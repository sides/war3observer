export function isInGame() {
  return app.game && app.game.game.is_in_game;
}

export function getPlayers() {
  return !app.settings.reversePlayerOrder
    ? app.game.players.slice()
    : app.game.players.slice().reverse();
}

export function getTeams() {
  return getPlayers().reduce(splitTeams, {});
}

function splitTeams(teams, player) {
  teams[player.team_index] = teams[player.team_index] || [];
  teams[player.team_index].push(player);

  return teams;
}

export function getHudType() {
  if (app.settings.hudType === 'auto') {
    return app.game.players[0].race.toLowerCase();
  }

  return app.settings.hudType;
}
