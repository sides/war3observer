import * as m from 'mithril';
import Component from '../../common/Component';
import Progress from '../../common/components/Progress';

export default class CamoManabar extends Component {
  morph(value, max) {
    return `clip-path: inset(0 ${100 - Progress.getPercent(value, max)}% 0 0%); background-color: #0000ff;`;
  }

  view(vnode) {
    return (
      <Progress
        {...vnode.attrs}
        morpher={this.morph} />
    );
  }
}
