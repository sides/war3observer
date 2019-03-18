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

    self.state = dict(game=dict(is_in_game=False), players=[])

  def _get_game_state(self):
    if self._game_mm is None:
      self._game_mm = SharedMemoryFile(4, self._game_size)

    parsed = ObserverGame.parse(self._game_mm.data())
    del parsed._io

    return parsed

  def _get_player_state(self, index):
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

  def _find_players(self, count):
    self._clear_players()

    # Hardcoded 24-player limit (unlikely to change before Reforged)
    for i in range(0, 23):
      mm = SharedMemoryFile(4+self._game_size+self._player_size*i, self._player_size)
      player = ObserverPlayer.parse(mm.data())
      if player.type == "PLAYER" or player.type == "COMPUTER":
        self._player_mms.append(mm)
        if len(self._player_mms) >= count:
          return
      else:
        mm.close()

    raise Exception("Attempted to find %s players but found only %s" % (count, len(self._player_mms)))

  def close(self):
    """Close the game's file handles and clear the state"""

    self.state = dict(game=dict(is_in_game=False), players=[])

    if not self._game_mm is None:
      self._game_mm.close()
      self._game_mm = None

    self._clear_players()

  def update(self):
    """Update the game state"""

    game_state = self._get_game_state()

    if not game_state['is_in_game']:
      self.state = dict(game=game_state, players=[])
      return self.state

    # If in the previous state we were not in a game, or there is a
    # mismatch of players, then we will search for players again. The
    # former is only needed for platforms such as Netease, where e.g.
    # if two players are playing in a 4-player map (TM, TR) there can
    # exist a gap (empty player) between the two.
    if not self.state['game']['is_in_game'] or len(self._player_mms) != game_state['players_count']:
      self._find_players(game_state['players_count'])

    player_states = []
    for index, mm in enumerate(self._player_mms):
      player_states.append(self._get_player_state(index))

    self.state = dict(game=game_state, players=player_states)
    return self.state
