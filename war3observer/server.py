import asyncio
import websockets
import json

from .game import Game

class Server():
  def __init__(self, config):
    self.config = config
    self.game = Game()

  def serve(self):
    start_server = websockets.serve(self.send_state, 'localhost', self.config.get('port', 8765))

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

  async def send_state(self, websocket, path):
    try:
      while True:
        state = await self.game.update()
        await websocket.send(json.dumps(state, default=lambda o: None, separators=(',', ':')))
        await asyncio.sleep(2)
    except:
      raise
    finally:
      # Close the game on errors or exit. You may start getting
      # permission errors if this doesn't properly close out.
      self.game.close()
