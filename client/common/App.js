import * as m from 'mithril';

export default class App {
  constructor({ port, settings } = {}) {
    this.game = null;
    this.settings = settings || {};

    this._components = [];
    this._ws = null;
    this._wsPort = port || '8124';
    this._wsReconnectTries = 120;
  }

  addComponent(component) {
    this._components.push(component);
  }

  boot() {
    window.addEventListener('beforeunload', e => this._ws && this._ws.close(1000));
    this.connect(this._wsReconnectTries);

    m.mount(document.getElementById('app'), { view: () => this._components.map(m) });
  }

  connect(tries) {
    this._ws = new WebSocket(`ws://localhost:${this._wsPort}/`);
    this._ws.onmessage = this.onmessage.bind(this);

    if (tries > 0) {
      this._ws.onclose = e => e.code !== 1000 && setTimeout(() => this.connect(tries - 1), 5000);
      this._ws.onopen = e => this._ws.onclose = z => z.code !== 1000 && setTimeout(() => this.connect(this._wsReconnectTries), 5000);
    }
  }

  onmessage(event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'state':
        this.game = data.content;
        break;

      case 'settings':
        Object.assign(this.settings, data.content);
        break;
    }

    m.redraw();
  }
}
