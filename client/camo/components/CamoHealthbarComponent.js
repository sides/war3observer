import * as m from 'mithril';
import ProgressComponent from '../../common/components/ProgressComponent';

export default class HealthbarComponent extends ProgressComponent {
  morph(value, max) {
    const percent = this.getPercent(value, max);
    const hue = Math.round(120 * (percent / 100));

    return `clip-path: inset(0 ${100 - percent}% 0 0%); background-color: hsl(${hue}, 100%, 50%);`;
  }
}
