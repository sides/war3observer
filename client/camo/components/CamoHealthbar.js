import * as m from 'mithril';
import Component from '../../common/Component';
import Progress from '../../common/components/Progress';

export default class CamoHealthbar extends Component {
  morph(value, max) {
    const percent = Progress.getPercent(value, max);
    const hue = Math.round(120 * (percent / 100));

    return `clip-path: inset(0 ${100 - percent}% 0 0%); background-color: hsl(${hue}, 100%, 50%);`;
  }

  view(vnode) {
    return (
      <Progress
        {...vnode.attrs}
        morpher={this.morph} />
    );
  }
}
