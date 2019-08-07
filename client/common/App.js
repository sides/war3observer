import * as m from 'mithril';
import Component from './Component';
import defaultSettings from './App.json';

export default class App extends Component {
  constructor({ host, port, settings } = {}) {
    super();

    this.game = null;
    this.settings = {};
    Object.assign(this.settings, this.defaultSettings(), settings || {});

    this.host = host || 'localhost';
    this.port = port || '8124';

    this._ws = null;
    this._wsReconnectTries = 120;
  }

  defaultSettings() {
    return defaultSettings;
  }

  boot() {
    window.addEventListener('beforeunload', e => this._ws && this._ws.close(1000));
    this.connect(this._wsReconnectTries);

    m.mount(document.getElementById('app'), this);
  }

  connect(tries) {
    this._ws = new WebSocket(`ws://${this.host}:${this.port}/`);
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
