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

export function getHeroLevelProgress(hero) {
  if (!hero.level) {
    return 0;
  }

  // Make these settings if they need to change (in e.g. a custom map).
  // They're found in the gameplay constants table. I'm not fully sure
  // what the `NeedHeroXPFormulaA` and `NeedHeroXPFormulaC` modifiers
  // do.
  let baseXp = 200;
  const xpDelta = 100;

  let level = 1;
  let currentLevelXp = 0;

  // Rev up your fibonaccis
  while (level < hero.level) {
    currentLevelXp += baseXp;
    baseXp += xpDelta;
    level++;
  }

  return (hero.experience - currentLevelXp) / (hero.experience_max - currentLevelXp);
}
