import * as m from 'mithril';
import HeroOverviewComponent from '../../common/components/HeroOverviewComponent';
import CamoHealthbarComponent from './CamoHealthbarComponent';
import CamoManabarComponent from './CamoManabarComponent';

export default class CamoHeroOverviewComponent extends HeroOverviewComponent {
  statusBars() {
    return {
      health: CamoHealthbarComponent,
      mana: CamoManabarComponent
    };
  }
}
