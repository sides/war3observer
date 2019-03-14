import './Camo.scss';
import * as m from 'mithril';
import App from '../common/App';
import CamoTeamsOverview from './components/CamoTeamsOverview';

export default class CamoTeamVersusApp extends App {
  defaultSettings() {
    return Object.assign(super.defaultSettings(), {
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
