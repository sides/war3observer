import asyncio
import mmap

from war3structs.observer import ObserverGame, ObserverPlayer

class SharedMemoryFile():
  """SharedMemoryFile class

  This opens a memory mapped file at the specified offset with the
  specified size, but takes care of having the offset conform to the
  ALLOCATIONGRANULARITY for you. Read the entire file with the data()
  method.
  """

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
  """Game class

  A game updates the state from the observer API.
  """

  _game_size = ObserverGame.sizeof()
  _player_size = ObserverPlayer.sizeof()

  def __init__(self):
    self._game_mm = None
    self._player_mms = []

    self.state = {}

  async def _get_game_state(self):
    parsed = ObserverGame.parse(self._game_mm.data())
    del parsed._io
    return parsed

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

    for research in player.researches_in_progress:
      del research._io

    return player

  def _clear_players(self):
    for mm in self._player_mms:
      mm.close()
    self._player_mms = []

  def close(self):
    """Close the game's file handles and clear the state"""

    self.state = {}

    if not self._game_mm is None:
      self._game_mm.close()
      self._game_mm = None

    self._clear_players()

  async def update(self):
    """Update the game state"""

    if self._game_mm is None:
      self._game_mm = SharedMemoryFile(4, self._game_size)

    self.state['game'] = await self._get_game_state()

    if not self.state['game']['is_in_game']:
      self.state['players'] = []
      return self.state

    if len(self._player_mms) != self.state['game']['players_count']:
      self._clear_players()
      for i in range(0, self.state['game']['players_count']):
        mm = SharedMemoryFile(4+self._game_size+self._player_size*i, self._player_size)
        self._player_mms.append(mm)

    tasks = []
    for index, mm in enumerate(self._player_mms):
      tasks.append(self._get_player_state(index))

    self.state['players'] = await asyncio.gather(*tasks)

    return self.state
