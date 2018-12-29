import * as m from 'mithril';
import { getPlayerColor } from '../utils/color';
import Component from '../Component';

export default class TeamColoredLabelComponent extends Component {
  view(vnode) {
    const color = getPlayerColor(vnode.attrs.player);

    return <span class={`color-team-${color}`}>{vnode.children}</span>;
  }
}
