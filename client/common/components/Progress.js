import * as m from 'mithril';
import Component from '../Component';

export default class Progress extends Component {
  static getPercent(value, max) {
    return Math.round(value / max * 10000) / 100;
  }

  morph(value, max) {
    return `width: ${Progress.getPercent(value, max)}%`;
  }

  view(vnode) {
    const { type, value, max, morpher=this.morph } = vnode.attrs;

    return (
      <div class={`Progress Progress--${type}`}>
        <div class="Progress-bar" style={morpher(value, max)}></div>
      </div>
    );
  }
}
