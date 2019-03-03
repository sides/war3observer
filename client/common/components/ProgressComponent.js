import * as m from 'mithril';
import Component from '../Component';

export default class ProgressComponent extends Component {
  getPercent(value, max) {
    return Math.round(value / max * 10000) / 100;
  }

  morph(value, max) {
    return `width: ${this.getPercent(value, max)}%`;
  }

  view(vnode) {
    const { type, value, max } = vnode.attrs;

    return (
      <div class={`Progress Progress--${type}`}>
        <div class="Progress-bar" style={this.morph(value, max)}></div>
      </div>
    );
  }
}
