import * as m from 'mithril';
import { teamToColorName, getPlayerColor } from '../utils/color';
import Component from '../Component';
import Resource from './ResourceComponent';

export default class ResourcePanelComponent extends Component {
  icons() {
    return {};
  }

  view() {
    if (!app.game || !app.game.game.is_in_game) {
      return null;
    }

    const icons = this.icons();

    return (
      <div class="ResourcePanel">
        {app.game.players.map(player => (
          <div class={`ResourcePanel-player ResourcePanel-player--${teamToColorName(player.team_index)}`}>
            <Resource
              icon={icons[player.race.toLowerCase()]}
              class={`color-team-${getPlayerColor(player)}`}>
              {player.name}
            </Resource>

            <Resource icon={icons.gold}>
              {player.gold}
            </Resource>

            <Resource icon={icons.lumber}>
              {player.lumber}
            </Resource>

            <Resource icon={icons.supply}>
              {player.food}/{player.food_max}
            </Resource>
          </div>
        ))}
      </div>
    );
  }
}
