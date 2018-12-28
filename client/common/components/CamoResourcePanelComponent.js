import * as m from 'mithril';
import Component from '../Component';
import './CamoResourcePanelComponent.scss';

export default class ResourcesComponent extends Component {
  view() {
    if (!app.game || app.game.players.length !== 2) {
      return null;
    }

    const p1 = app.game.players[0];
    const p2 = app.game.players[1];

    return (
      <div class="Resources">
      </div>
    );
  }
}
