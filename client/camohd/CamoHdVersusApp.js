import './CamoHd.scss';
import * as m from 'mithril';
import App from '../common/App';
import CamoResourcesOverview from '../camo/components/CamoResourcesOverview';
import CamoHeroesOverview from '../camo/components/CamoHeroesOverview';

export default class CamoVersusApp extends App {
  defaultSettings() {
    return Object.assign(super.defaultSettings(), {
      iconRoot: 'icons/hd/'
    });
  }

  view() {
    return [
      <CamoResourcesOverview />,
      <CamoHeroesOverview />
    ];
  }
}
