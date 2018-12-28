import * as m from 'mithril';
import Component from '../Component';

const raceIcons = {
  HUMAN: 'icons/hpea.jpg',
  ORC: 'icons/opeo.jpg',
  UNDEAD: 'icons/uaco.jpg',
  NIGHTELF: 'icons/ewsp.jpg'
};

export default class RaceIconComponent extends Component {
  view() {
    const { race, ...attrs } = this.attrs;
    const icon = raceIcons[race] || 'icons/Aall.jpg';

    return <img class="RaceIcon" src={icon} {...attrs} />;
  }
}
