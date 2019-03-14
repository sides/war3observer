import * as m from 'mithril';
import Component from '../Component';

export default class Icon extends Component {
  view(vnode) {
    const { id, ...attrs } = vnode.attrs;

    return <img src={`icons/${id}.jpg`} {...attrs} />;
  }
}
