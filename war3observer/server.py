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
    self._clients = set()
    self.config = Server.setdefaults(config)
    self.game = Game()

    logging.basicConfig(
      level=self.config['loggingLevel'],
      format='%(levelname)s: %(message)s')

  def serve(self):
    logging.info('observer %s' % __version__)
    logging.debug('observer - Starting with config %s' % self.config)

    start_server = websockets.serve(self.connect_client, 'localhost', self.config['port'])

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

  def state_event(self, state):
    return json.dumps({ 'type': 'state', 'content': state }, default=lambda o: None)

  def settings_event(self, settings):
    return json.dumps({ 'type': 'settings', 'content': settings })

  async def send_state_to_client(self, websocket):
    while True:
      try:
        state = self.game.update()
      except:
        logging.exception('An error occurred while updating the game state')
        state = None

      await websocket.send(self.state_event(state))
      await asyncio.sleep(2)

  async def receive_client_messages(self, websocket):
    async for message in websocket:
      data = json.loads(message)
      if data['action'] == 'setClientSettings':
        await websocket.send(self.settings_event(data['content']))

  async def connect_client(self, websocket, path):
    logging.debug('observer - Client connected')

    self._clients.add(websocket)

    try:
      # Begin by sending the client settings once
      await websocket.send(self.settings_event(self.config['clientSettings']))

      # Send an updated state periodically
      send_state = asyncio.create_task(
        self.send_state_to_client(websocket))

      # Check for messages
      respond = asyncio.create_task(
        self.receive_client_messages(websocket))

      await asyncio.wait([send_state, respond])
    finally:
      logging.debug('observer - Client closed')

      self._clients.remove(websocket)

      # Stop sending the state
      send_state.cancel()

      # Close the game if this was the last client
      if not self._clients:
        logging.debug('observer - Was last client, closing game')

        self.game.close()
