import asyncio
import websockets
import json
import logging

from . import __version__
from .game import Game

class Server():
  def setdefaults(config):
    config.setdefault('loggingLevel', logging.INFO)
    config.setdefault('port', 8765)
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

    # Start the websocket server
    connect_client = websockets.serve(self.connect_client, 'localhost', self.config['port'])
    asyncio.get_event_loop().run_until_complete(connect_client)

    # Send the game state to all connected clients on a fixed timer
    send_state = self.send_state_to_clients()
    asyncio.ensure_future(send_state)

    asyncio.get_event_loop().run_forever()

  def state_event(self, state):
    return json.dumps({ 'type': 'state', 'content': state }, default=lambda o: None)

  def settings_event(self, settings):
    return json.dumps({ 'type': 'settings', 'content': settings })

  async def send_state_to_clients(self):
    while True:
      try:
        state = await self.game.update()

        for websocket in self._clients:
          await websocket.send(self.state_event(state))
      except:
        logging.exception('An error occurred while updating the game state')

      await asyncio.sleep(2)

  async def connect_client(self, websocket, path):
    logging.debug('observer - Client connected')

    self._clients.add(websocket)

    try:
      # Begin by sending the client settings once followed by the
      # current game state
      await websocket.send(self.settings_event(self.config['clientSettings']))
      await websocket.send(self.state_event(self.game.state))

      # Start checking for messages
      await self._receive_client_messages(websocket)
    finally:
      logging.debug('observer - Client closed')

      self._clients.remove(websocket)

      if not self._clients:
        logging.debug('observer - Was last client, closing game')

        # Close the game if all clients have disconnected
        self.game.close()

  async def _receive_client_messages(self, websocket):
    async for message in websocket:
      data = json.loads(message)
      if data['action'] == 'setClientSettings':
        await websocket.send(self.settings_event(data['content']))
