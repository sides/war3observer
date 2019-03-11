import * as m from 'mithril';
import { teamToColorName } from '../utils/color';
import { isInGame, getPlayers } from '../utils/game';
import Component from '../Component';
import Hero from './HeroComponent';

export default class HeroOverviewComponent extends Component {
  statusBars() {
    return {};
  }

  view() {
    if (!isInGame()) {
      return null;
    }

    const { health, mana } = this.statusBars();

    return (
      <div class="HeroOverview">
        {getPlayers().map(player => (
          <div class={`HeroOverview-player HeroOverview-player--team-${teamToColorName(player.team_index)}`}>
            {player.heroes.slice().reverse().map(hero => (
              <Hero
                hero={hero}
                showPortrait={!app.settings.hideHeroPortraits}
                showStatus={!app.settings.hideHeroStatus}
                healthComponent={health}
                manaComponent={mana}
                showAbilities={!app.settings.hideHeroAbilities}
                showItems={!app.settings.hideHeroItems} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
