"""
Models for store data.

In long term view, it collects and keeps data. Reduces time of refresh
from web clients to receive data.
"""


class Storage:
    """Keeps raw events received from game."""

    state = dict()
    updated = -1

    @classmethod
    def reset(cls):
        """Reset state of storage."""
        cls.state = dict()
        cls.updated = -1

    @classmethod
    def update(cls, data):
        """Updates storage of provided data.

        Data won't be updated when game is paused.
        """
        game_time = data['game']['game_time']
        if game_time > cls.updated:
            cls.state = data
