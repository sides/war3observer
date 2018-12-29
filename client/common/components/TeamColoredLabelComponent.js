import * as m from 'mithril';
import { getPlayerColor } from '../utils/color';
import Component from '../Component';

export default class TeamColoredLabelComponent extends Component {
  view() {
    const color = getPlayerColor(this.attrs.player);

    return <span class={`color-team-${color}`}>{this.children}</span>;
  }
}
