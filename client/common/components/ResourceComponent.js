import * as m from 'mithril';
import Component from '../Component';

export default class ResourcePanelComponent extends Component {
  view() {
    return (
      <div class={`Resource ${this.attrs.class || ''}`}>
        {this.attrs.icon
          ? <img class="Resource-icon" src={this.attrs.icon} />
          : ''
        }
        <span class="Resource-label">
          {this.children}
        </span>
      </div>
    );
  }
}
