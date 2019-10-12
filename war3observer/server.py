import asyncio
import copy
import websockets
import json
import logging

from . import __version__
from .game import Game
from . import storage


def dump_state(state):
  event = {'type': 'state', 'content': state}
  return json.dumps(event, default=lambda o: None)


def dump_settings(settings):
  event = {'type': 'settings', 'content': settings}
  return json.dumps(event)


class Server:

  # How often update state of game (in seconds)
  refresh_rate = 2

  # How often send data to clients (in seconds)
  send_client_rate = 5

  def setdefaults(config):
    config.setdefault('loggingLevel', logging.DEBUG)
    config.setdefault('host', 'localhost')
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

    start_server = websockets.serve(
        self.on_client_connect,
        self.config['host'],
        self.config['port']
    )

    loop = asyncio.get_event_loop()

    tasks = [
      self.update_game_state(),
      start_server,
    ]
    loop.run_until_complete(asyncio.gather(*tasks))
    loop.run_forever()

  async def on_client_connect(self, websocket, path):
    logging.info('Webclient connected')
    self._clients.add(websocket)

    try:
      # Begin by sending to web client our settings
      raw_settings = dump_settings(self.config['clientSettings'])
      await websocket.send(raw_settings)

      corutines = [
        # periodically send an updated state
        self.send_state_to_client(websocket),

        # Check for messages from web clients
        self.receive_client_messages(websocket)
      ]

      tasks = [
        asyncio.create_task(task)
        for task in corutines
      ]
      await asyncio.wait(tasks)
    finally:
      logging.info('observer - Client closed')
      self._clients.remove(websocket)

      # Stop sending the state
      send_state.cancel()

      # Close the game if this was the last client
      if not self._clients:
        logging.info('observer - last client closed connection, closing game')
        self.game.close()

  async def update_game_state(self):
    while True:
      try:
        # receive state from game
        state = self.game.update()
        storage.Storage.update(state)

        # update refresh rate from game
        self.refresh_rate = self._get_refresh_rate(state)

        logging.info('Game state updated')
      except KeyboardInterrupt:
        raise
      except:
        logging.exception('An error occurred while updating the game state')

      await asyncio.sleep(self.refresh_rate)

  async def send_state_to_client(self, websocket):
    while True:
      data = dump_state(storage.Storage.state)
      await websocket.send(data)
      logging.info('State was send to client')

      await asyncio.sleep(self.send_client_rate)

  async def receive_client_messages(self, websocket):
    while True:
      async for message in websocket:
        data = json.loads(message)
        if data['action'] == 'setClientSettings':
          for other_websocket in self._clients:
            if other_websocket == websocket:
              continue
            event = dump_settings(data['content'])
            await other_websocket.send(event)

      await asyncio.sleep(self.send_client_rate)

  def _get_refresh_rate(self, game_state):
    """Returns refresh rate from game in seconds."""
    refresh_rate = game_state.get('game', {}).get('refresh_rate')
    if refresh_rate:
      return game['refresh_rate'] // 1000

    return self.refresh_rate
