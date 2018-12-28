import * as m from 'mithril';
import { teamToColorName } from '../utils/color';
import Component from '../Component';

export default class TeamColoredLabelComponent extends Component {
  view() {
    return <span class={`color-team-${teamToColorName(this.attrs.team)}`}>{this.children}</span>;
  }
}
