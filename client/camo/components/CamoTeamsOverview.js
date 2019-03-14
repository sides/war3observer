import * as m from 'mithril';
import { teamToColorName } from '../../common/utils/color';
import { isInGame, getTeams } from '../../common/utils/game';
import Component from '../../common/Component';
import Player from '../../common/components/Player';

export default class PlayersOverview extends Component {
  resourceIcons() {
    return {
      human: require('../assets/ui/human.png'),
      orc: require('../assets/ui/orc.png'),
      nightelf: require('../assets/ui/nightelf.png'),
      undead: require('../assets/ui/undead.png'),
      gold: require('../assets/ui/gold.png'),
      lumber: require('../assets/ui/lumber.png'),
      supply: require('../assets/ui/supply.png')
    };
  }

  view() {
    if (!isInGame()) {
      return null;
    }

    const teams = getTeams();

    return (
      <div class="TeamsOverview">
        {Object.keys(teams).map(teamIndex => (
          <div class={`Team Team--${teamToColorName(teamIndex)}`}>
            {teams[teamIndex].map(player => (
              <Player player={player} resourceIcons={this.resourceIcons()} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
