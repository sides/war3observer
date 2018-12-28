export default class Component {
  get attrs() {
    return this._vnode.attrs;
  }

  get state() {
    return this._vnode.state;
  }

  get tag() {
    return this._vnode.tag;
  }

  get children() {
    return this._vnode.children;
  }

  constructor(vnode) {
    vnode = vnode || {};
    vnode.attrs = vnode.attrs || {};
    vnode.state = vnode.state || {};
    vnode.tag = vnode.tag || '';
    vnode.children = vnode.children || [];

    this._vnode = vnode;
  }

  view(vnode) {
    return null;
  }
}
