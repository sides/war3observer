import * as m from 'mithril';

export default class App {
  constructor({ port, settings } = {}) {
    this.game = null;
    this.settings = settings || {};

    this._components = [];
    this._ws = null;
    this._port = port || '8765';
  }

  addComponent(component) {
    this._components.push(component);
  }

  boot() {
    this._ws = new WebSocket(`ws://localhost:${this._port}/`);
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
        Object.assign(this.settings, data.content);
        break;
    }

    m.redraw();
  }

  isInGame() {
    return app.game && app.game.game.is_in_game;
  }

  getPlayers() {
    return !app.settings.reversePlayerOrder
      ? app.game.players.slice()
      : app.game.players.slice().reverse();
  }
}
