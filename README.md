## Summary

war3observer is a tool that keeps a local webpage updated with data from the Warcraft III observer API. This can be used for streaming tools such as OBS to render the data on stream.

It runs a local websocket server which sends a message with the entire state periodically. It uses [war3structs](https://github.com/warlockbrawl/war3structs) to parse the state from the memory mapped file. A web client written in [mithril.js](https://github.com/MithrilJS/mithril.js/) is included to render the state.

![screenshot example](/screenshots/replay-example.jpg)


## Usage

- [Download the latest release](https://github.com/warlockbrawl/war3observer/releases)
- Extract it somewhere
- In OBS, add a browser source to your scene, tick `Local file` and select any of the `.html` files in the `client` folder you extracted
- Set the width and height to 1920x1080 for 16:9, 1440x1080 for 4:3, scale it in OBS as needed
- For best performance (optional):
  - One file = one source: Use existing sources between scenes
  - If you stream other types of content (i.e. you don't exclusively cast Warcraft III games), keep these sources contained in their own scene collection OR enable `Shutdown source when not visible` on them
  - If the source has no animations the FPS can be set to something low, like 5
- Now you can run `war3observer.exe` whenever you want the overlay to start updating

You generally shouldn't, but if you experience the overlay not updating properly, you can try any of these:

- Restart `war3observer.exe` (after you've started Warcraft III)
- Refresh the browser cache in OBS (double-click on the source, hit OK)


### Advanced usage

For advanced options you can create a file called `war3observer.config.json` in the same directory as `war3observer.exe`. Example config file:

```json
{
  "port": 8657,
  "clientConfig": {
    "useTeamColors": true,
    "hideHeroItems": true,
    "reversePlayerOrder": true
  }
}
```

`war3observer.exe` also comes with some command-line options, run it with `--help` for details.


#### Controlling the overlay

It's possible to control the overlay beyond OBS scenes with an external program. Send a message to the server of this form:

```json
{
  "action": "set_config",
  "content": {
    "hideHeroItems": false
  }
}
```

And all listening clients will update their settings accordingly.


## Updating

To update to the latest version you can download the latest release and extract the contents to wherever you have the previous version installed (replacing files). If you are using the included client you will have to clear the browser cache in OBS as well.


## Development

To set up:

- Have [Python 3](https://www.python.org/), [node](https://nodejs.org/en/), and Warcraft III installed
- `git clone https://github.com/warlockbrawl/war3observer.git`
- `cd war3observer`
- `pip install -r requirements.txt -r requirements-dev.txt`
- `python -m war3observer` to start the server
- `cd client`
- `npm install`
- `npm run start` to watch for changes and build the client (rerun this whenever a new view is added)
- `mkdir dist\icons`
- `python ..\tools\extract_icons.py <wc3 installation dir> .\dist\icons` if you want to include icons


### Making custom views

If you're interested in making personalized views and you want to make use of the included client's setup and components, you can use the `war3observer-client-tools` package on npm.

> Note: If you only want to edit a view's settings and/or add custom CSS, you can just copy+paste one of the included views and edit its HTML. Add custom CSS in `<style>` tags or link to one; change `app.settings` before the call to `app.boot()`.

Create a directory for your project that contains these files:

**package.json**

```json
{
  "private": true,
  "scripts": {
    "start": "webpack -d --watch",
    "build": "webpack -p"
  }
}
```

**webpack.config.js**

```js
const config = require('war3observer-client-tools');

module.exports = config;
```

**views/\<your view\>/app.js**

```js
import App from 'war3observer-client-tools/common/App';

const app = new App();

export { app };
```

Now you can `npm install --save-dev war3observer-client-tools` and `npm run build` and it will create your view in `dist`.
