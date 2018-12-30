import * as m from 'mithril';
import { teamToColorName } from '../utils/color';
import Component from '../Component';
import Hero from './HeroComponent';

export default class HeroOverviewComponent extends Component {
  view() {
    if (!app.game || !app.game.game.is_in_game) {
      return null;
    }

    return (
      <div class="HeroOverview">
        {app.game.players.map(player => (
          <div class={`HeroOverview-player HeroOverview-player--${teamToColorName(player.team_index)}`}>
            {player.heroes.reverse().map(hero => (
              <Hero hero={hero} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
