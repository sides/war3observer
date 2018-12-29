import * as m from 'mithril';
import { getPlayerColor } from '../utils/color';
import Component from '../Component';
import Resource from './ResourceComponent';

export default class ResourcePanelComponent extends Component {
  constructor(vnode) {
    super(vnode);

    this.resourceIcons = {};
  }

  view() {
    if (!app.game || app.game.players.length !== 2) {
      return null;
    }

    const p1 = app.game.players[0];
    const p2 = app.game.players[1];

    return (
      <div class="ResourcePanel">
        {[p1, p2].map(player => (
          <div class={`ResourcePanel-player ResourcePanel--${player.team_index === 0 ? 'left' : 'right'}`}>
            <Resource
              icon={this.resourceIcons[player.race.toLowerCase()]}
              class={`color-team-${getPlayerColor(player)}`}>
              {player.name}
            </Resource>

            <Resource icon={this.resourceIcons.gold}>
              {player.gold}
            </Resource>

            <Resource icon={this.resourceIcons.lumber}>
              {player.lumber}
            </Resource>

            <Resource icon={this.resourceIcons.supply}>
              {player.food}/{player.food_max}
            </Resource>
          </div>
        ))}
      </div>
    );
  }
}
