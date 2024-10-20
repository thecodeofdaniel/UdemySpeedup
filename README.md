# Udemy Speedup

![UdemySpeedup Extension](./imgs/extension.png)

Get the add-on
[here!](https://addons.mozilla.org/en-US/firefox/addon/udemy-speedup/)

Add more playback rates to Udemy videos. Use the `[` and `]` keys to quickly
change playback. Skip the "Up next" screen and skip long intros or outros if you
so choose!

## Steps to build/edit extension

Install NodeJS (LTS) version 20. However if you use nvm or some other version
manager, you can use the `.nvmrc` or `.node-version` file to get my exact node
version. Run the following command if you use nvm.

```bash
nvm install
```

I used `web-ext` for my development environment. You can find how to install it
[here](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).
However if you're already using node/npm then run.

```bash
npm install --global web-ext
```

Then run the following to open up the environment

```bash
web-ext run
```

### Styling

I'm using tailwindcss to style my extension, so we'll need to generate the css.
This will take the `input.css` and generates the `output.css`. Run the following
command in the root project to generate the css once.

```bash
npm run tailwind:build
```

If you want to make and watch your changes.

```bash
npm run tailwind:watch
```

## Layout

Using the following command

```bash
tree src
```

You'll get the structure of the project. Let's run it down.

- The `background` dir has a file to control whether the extension is enabled
  based on the URL. As well as run a content script
  (**5_update_playback_text.js**) to update the playback text on screen when the
  user clicks onto a new tab.
- The `content_scripts` dir has files to find, watch, and use elements in the
  DOM. Each file has a comment at the top explaining its purpose :)
- The `popup` dir has files to control the look and behaviour of the extension.
  Sending messages to content scripts (**2_popup_listener.js**) when the
  playback speed changes.
