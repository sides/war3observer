#!/usr/bin/env python

import asyncio
import websockets
import json
import mmap

from war3structs.observer import ObserverGame, ObserverPlayer

class SharedMemoryFile():
  def __init__(self, offset, size):
    self._seek_offset = offset % mmap.ALLOCATIONGRANULARITY
    self._mmap = mmap.mmap(
      -1,
      (size + self._seek_offset),
      "War3StatsObserverSharedMemory",
      offset=(offset - self._seek_offset),
      access=mmap.ACCESS_READ)

  def data(self):
    self._mmap.seek(self._seek_offset)
    return self._mmap.read()

  def close(self):
    self._mmap.close()

class Game():
  _game_size = ObserverGame.sizeof()
  _player_size = ObserverPlayer.sizeof()

  def __init__(self):
    self._game_mm = None
    self._player_mms = []

  async def _get_game_state(self):
    parsed = ObserverGame.parse(self._game_mm.data())
    del parsed._io
    return parsed

  def _close_players(self):
    for mm in self._player_mms:
      mm.close()
    self._player_mms = []

  def close(self):
    if not self._game_mm is None:
      self._game_mm.close()
      self._game_mm = None
    self._close_players()

  async def _get_player_state(self, index):
    player = ObserverPlayer.parse(self._player_mms[index].data())

    # We can do some light processing here. For now, just delete the _io
    # garbage from construct as well as the counts which we don't need.
    del player._io
    del player.heroes_count
    del player.buildings_on_map_count
    del player.upgrades_completed_count
    del player.units_on_map_count
    del player.researches_in_progress_count

    for hero in player.heroes:
      del hero._io
      del hero.abilities_count
      del hero.inventory_count

      for ability in hero.abilities:
        del ability._io

      for item in hero.inventory:
        del item._io

    for building in player.buildings_on_map:
      del building._io

    for upgrade in player.upgrades_completed:
      del upgrade._io

    for unit in player.units_on_map:
      del unit._io

    return player

  async def get_state(self):
    if self._game_mm is None:
      self._game_mm = SharedMemoryFile(4, self._game_size)

    game_state = await self._get_game_state()
    player_states = []

    if game_state['is_in_game']:
      if len(self._player_mms) != game_state['players_count']:
        self._close_players()
        for i in range(0, game_state['players_count']):
          mm = SharedMemoryFile(4+self._game_size+self._player_size*i, self._player_size)
          self._player_mms.append(mm)

      tasks = []
      for index, mm in enumerate(self._player_mms):
        tasks.append(self._get_player_state(index))

      player_states = await asyncio.gather(*tasks)

    return dict(game=game_state, players=player_states)

async def send_state(websocket, path):
  game = Game()

  try:
    while True:
      state = await game.get_state()
      await websocket.send(json.dumps(state, default=lambda o: None, indent=2))
      await asyncio.sleep(2)
  except:
    raise
  finally:
    game.close()

if __name__ == '__main__':
  start_server = websockets.serve(send_state, 'localhost', 8765)

  asyncio.get_event_loop().run_until_complete(start_server)
  asyncio.get_event_loop().run_forever()
