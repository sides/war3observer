import * as m from 'mithril';
import { isInGame, getPlayers, getHudType } from '../../common/utils/game';
import Component from '../../common/Component';
import ResourcePanel from '../../common/components/ResourcePanel';

export default class ResourcesOverview extends Component {
  icons() {
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

    return (
      <div class={`ResourcesOverview ResourcesOverview--${getHudType()}`}>
        {getPlayers().map(player => (
          <ResourcePanel player={player} icons={this.icons()} />
        ))}
      </div>
    );
  }
}
