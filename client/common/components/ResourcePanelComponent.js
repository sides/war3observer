import * as m from 'mithril';
import { getPlayerColor } from '../utils/color';
import Component from '../Component';
import Resource from './ResourceComponent';

export default class ResourcePanelComponent extends Component {
  icons() {
    return {};
  }

  view() {
    if (!app.game || app.game.players.length !== 2) {
      return null;
    }

    const p1 = app.game.players[0];
    const p2 = app.game.players[1];

    const icons = this.icons();

    return (
      <div class="ResourcePanel">
        {[p1, p2].map(player => (
          <div class={`ResourcePanel-player ResourcePanel--${player.team_index === 0 ? 'left' : 'right'}`}>
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
