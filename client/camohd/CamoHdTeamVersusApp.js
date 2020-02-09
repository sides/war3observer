import './CamoHd.scss';
import * as m from 'mithril';
import App from '../common/App';
import CamoTeamsOverview from '../camo/components/CamoTeamsOverview';

export default class CamoTeamVersusApp extends App {
  defaultSettings() {
    return Object.assign(super.defaultSettings(), {
      iconRoot: 'icons/hd/',
      heroLevelPrecision: 0,
      showHeroStatus: false,
      showHeroStatusExperience: false
    });
  }

  view() {
    return [
      <CamoTeamsOverview />
    ];
  }
}
