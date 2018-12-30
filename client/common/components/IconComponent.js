import * as m from 'mithril';
import Component from '../Component';

export default class IconComponent extends Component {
  view(vnode) {
    const { id, ...attrs } = vnode.attrs;

    return <img src={`icons/${id}.jpg`} {...attrs} />;
  }
}
