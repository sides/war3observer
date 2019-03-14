import * as m from 'mithril';
import { getPlayerColor } from '../utils/color';
import { isInGame, getPlayers } from '../utils/game';
import Component from '../Component';
import Hero from './Hero';
import ResourcePanel from './ResourcePanel';

export default class Player extends Component {
  view(vnode) {
    const { player, resourceIcons } = vnode.attrs;

    return (
      <div class={`Player Player--${getPlayerColor(player)}`}>
        <div class="Player-resources">
          <ResourcePanel player={player} icons={resourceIcons} />
        </div>

        <div class="Player-heroes">
          {player.heroes.slice().reverse().map(hero => (
            <Hero
              hero={hero}
              showStatus={false}
              showAbilities={app.settings.showHeroAbilities}
              showItems={app.settings.showHeroItems} />
          ))}
        </div>
      </div>
    );
  }
}
