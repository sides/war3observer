import * as m from 'mithril';
import Component from '../Component';

export default class ResourceComponent extends Component {
  view(vnode) {
    return (
      <div class={`Resource ${vnode.attrs.class || ''}`}>
        {vnode.attrs.icon
          ? <img class="Resource-icon" src={vnode.attrs.icon} />
          : ''
        }
        <span class="Resource-label">
          {vnode.children}
        </span>
      </div>
    );
  }
}
