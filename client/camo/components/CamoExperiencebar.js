import * as m from 'mithril';
import Component from '../../common/Component';
import Progress from '../../common/components/Progress';

export default class CamoExperiencebar extends Component {
  morph(value, max) {
    return `clip-path: inset(0 ${100 - Progress.getPercent(value, max)}% 0 0%); background-color: #b100a6;`;
  }

  view(vnode) {
    return (
      <Progress
        {...vnode.attrs}
        morpher={this.morph} />
    );
  }
}
