import * as m from 'mithril';
import ProgressComponent from '../../common/components/ProgressComponent';

export default class ManabarComponent extends ProgressComponent {
  morph(value, max) {
    return `clip-path: inset(0 ${100 - this.getPercent(value, max)}% 0 0%); background-color: #0000ff;`;
  }
}
