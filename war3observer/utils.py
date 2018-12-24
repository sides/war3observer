class Event(list):
  """Event class

  Simple wrapper around list for a primitive event handler by longpoke.

  https://stackoverflow.com/questions/1092531/event-system-in-python
  """

  def __call__(self, *args, **kwargs):
    for f in self:
      f(*args, **kwargs)

  def __repr__(self):
    return "Event(%s)" % list.__repr__(self)
