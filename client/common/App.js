import './App.scss';

import * as m from 'mithril';

export default class App {
  constructor() {
    this.game = null;
    this.config = {};
    this._components = [];
    this._mount = null;
    this._ws = null;
  }

  addComponent(component) {
    this._components.push(component);
  }

  boot() {
    this._ws = new WebSocket("ws://localhost:8765/");
    this._ws.onmessage = this.onmessage.bind(this);

    m.mount(document.getElementById('app'), { view: () => this._components.map(m) });
  }

  onmessage(event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'state':
        this.game = data.content;
        break;

      case 'config':
        this.config = data.content;
        break;
    }

    m.redraw();
  }
}
