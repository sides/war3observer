import asyncio
import websockets
import json
import logging

from . import __version__
from .game import Game

class Server():
  def setdefaults(config):
    config.setdefault('loggingLevel', logging.INFO)
    config.setdefault('port', 8124)
    config.setdefault('clientSettings', {})

    return config

  def __init__(self, config):
    self.config = Server.setdefaults(config)
    self.game = Game()

    logging.basicConfig(
      level=self.config['loggingLevel'],
      format='%(levelname)s: %(message)s')

  def serve(self):
    logging.info('observer %s' % __version__)
    logging.debug('observer - Starting with config %s' % self.config)

    start_server = websockets.serve(self.start, 'localhost', self.config['port'])

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

  def state_event(self, state):
    return json.dumps({ 'type': 'state', 'content': state }, default=lambda o: None)

  def settings_event(self, settings):
    return json.dumps({ 'type': 'settings', 'content': settings })

  async def send_state(self, websocket):
    while True:
      try:
        state = await self.game.update()
        await websocket.send(self.state_event(state))
      except:
        logging.exception('An error occurred while updating the game state')

      await asyncio.sleep(2)

  async def respond(self, websocket):
    async for message in websocket:
      data = json.loads(message)
      if data['action'] == 'setClientSettings':
        await websocket.send(self.settings_event(data['content']))

  async def start(self, websocket, path):
    logging.debug('observer - Client connected')

    try:
      # Begin by sending the client settings once
      send_config = asyncio.create_task(
        websocket.send(self.settings_event(self.config['clientSettings'])))

      # Send an updated state periodically
      send_state = asyncio.create_task(
        self.send_state(websocket))

      # Check for messages
      respond = asyncio.create_task(
        self.respond(websocket))

      await asyncio.wait(
        [send_config, send_state, respond])
    finally:
      logging.debug('observer - Client closed')

      # Stop sending the state
      send_state.cancel()

      # Close the game
      self.game.close()
