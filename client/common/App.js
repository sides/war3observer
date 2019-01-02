import * as m from 'mithril';

export default class App {
  constructor({ port, settings } = {}) {
    this.game = null;
    this.settings = settings || {};

    this._components = [];
    this._ws = null;
    this._wsPort = port || '8765';
    this._wsReconnectTries = 500;
  }

  addComponent(component) {
    this._components.push(component);
  }

  boot() {
    this.connect(this._wsReconnectTries);

    m.mount(document.getElementById('app'), { view: () => this._components.map(m) });
  }

  connect(tries) {
    console.log(tries);
    this._ws = new WebSocket(`ws://localhost:${this._wsPort}/`);
    this._ws.onmessage = this.onmessage.bind(this);

    if (tries > 0) {
      this._ws.onclose = e => setTimeout(() => this.connect(--tries), 5000);
      this._ws.onopen = e => this._ws.onclose = z => setTimeout(() => this.connect(this._wsReconnectTries), 5000);
    }
  }

  onmessage(event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'state':
        this.game = data.content;
        break;

      case 'config':
        Object.assign(this.settings, data.content);
        break;
    }

    m.redraw();
  }
}
