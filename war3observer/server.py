import asyncio
import websockets
import json
import logging

from .game import Game

class Server():
  def setdefaults(config):
    config.setdefault('verbosity', logging.WARNING)
    config.setdefault('port', 8765)
    config.setdefault('clientConfig', {})

    return config

  def __init__(self, config):
    self.config = Server.setdefaults(config)
    self.game = Game()

    logging.basicConfig(
      level=self.config['verbosity'],
      format='%(relativeCreated)6d %(message)s')

  def serve(self):
    start_server = websockets.serve(self.start, 'localhost', self.config['port'])

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

  def state_event(self, state):
    return json.dumps({ 'type': 'state', 'content': state }, default=lambda o: None)

  def config_event(self, config):
    return json.dumps({ 'type': 'config', 'content': config })

  async def send_state(self, websocket):
    while True:
      state = await self.game.update()
      await websocket.send(self.state_event(state))
      await asyncio.sleep(2)

  async def respond(self, websocket):
    async for message in websocket:
      data = json.loads(message)
      if data['action'] == 'set_config':
        await websocket.send(self.config_event(data['content']))

  async def start(self, websocket, path):
    logging.debug('observer - Starting with config %s' % self.config)

    try:
      # Begin by sending the client config once
      await websocket.send(self.config_event(self.config['clientConfig']))

      # Send an updated state periodically
      asyncio.create_task(self.send_state(websocket))

      # Check for messages
      await self.respond(websocket)

    except websockets.exceptions.ConnectionClosed:
      pass
    except:
      raise
    finally:
      logging.debug('observer - Closing game')

      # Close the game on errors or exit. You may start getting
      # permission errors if this doesn't properly close out.
      self.game.close()
