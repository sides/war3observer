export function isInGame() {
  return app.game && app.game.game.is_in_game;
}

export function getPlayers() {
  return !app.settings.reversePlayerOrder
    ? app.game.players.slice()
    : app.game.players.slice().reverse();
}
