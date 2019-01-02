import * as m from 'mithril';
import { teamToColorName } from '../utils/color';
import { isInGame, getPlayers } from '../utils/game';
import Component from '../Component';
import Hero from './HeroComponent';

export default class HeroOverviewComponent extends Component {
  view() {
    if (!isInGame()) {
      return null;
    }

    return (
      <div class="HeroOverview">
        {getPlayers().map(player => (
          <div class={`HeroOverview-player HeroOverview-player--team-${teamToColorName(player.team_index)}`}>
            {player.heroes.slice().reverse().map(hero => (
              <Hero
                hero={hero}
                showPortrait={!app.settings.hideHeroPortraits}
                showAbilities={!app.settings.hideHeroAbilities}
                showItems={!app.settings.hideHeroItems} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
