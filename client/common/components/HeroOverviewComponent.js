import * as m from 'mithril';
import { teamToColorName } from '../utils/color';
import Component from '../Component';
import Hero from './HeroComponent';

export default class HeroOverviewComponent extends Component {
  view() {
    if (!app.isInGame()) {
      return null;
    }

    return (
      <div class="HeroOverview">
        {app.getPlayers().map(player => (
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
