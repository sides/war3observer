import * as m from 'mithril';
import { isInGame, getPlayers } from '../../common/utils/game';
import Component from '../../common/Component';
import Hero from '../../common/components/Hero';
import CamoHealthbar from './CamoHealthbar';
import CamoManabar from './CamoManabar';
import CamoExperiencebar from './CamoExperiencebar';

export default class HeroesOverview extends Component {
  view() {
    if (!isInGame()) {
      return null;
    }

    return (
      <div class="HeroesOverview">
        {getPlayers().map(player => (
          <div class="HeroesOverview-player">
            {player.heroes.slice().reverse().map(hero => (
              <Hero
                hero={hero}
                showStatus={app.settings.showHeroStatus}
                showStatusExperience={app.settings.showHeroStatusExperience}
                healthComponent={CamoHealthbar}
                manaComponent={CamoManabar}
                experienceComponent={CamoExperiencebar}
                showAbilities={app.settings.showHeroAbilities}
                showItems={app.settings.showHeroItems} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
