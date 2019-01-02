import * as m from 'mithril';
import { teamToColorName, getPlayerColor } from '../utils/color';
import { isInGame, getPlayers } from '../utils/game';
import Component from '../Component';
import Resource from './ResourceComponent';

export default class ResourcePanelComponent extends Component {
  icons() {
    return {};
  }

  type() {
    return app.settings.resourcePanelType || 'default';
  }

  view() {
    if (!isInGame()) {
      return null;
    }

    const icons = this.icons();
    const type = this.type();

    return (
      <div class={`ResourcePanel ResourcePanel--${type}`}>
        {getPlayers().map(player => (
          <div class={`ResourcePanel-player ResourcePanel-player--team-${teamToColorName(player.team_index)}`}>
            <Resource
              icon={icons[player.race.toLowerCase()]}
              class={`color-${getPlayerColor(player)}`}>
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
