# Udemy Speedup

![UdemySpeedup Extension](./imgs/extension.png)

This extension adds playback rates to Udemy videos. Ranging from 0.5x to 4x speed.
The user can either use the range input or the text input for finer control if they so choose.

**NOTE**: It may not apply at times, if that happens just refresh the page.

## Steps to build/edit extension

Install node and if you're using nvm. You can use the `.nvmrc` file to get my exact node version. Run the following command within the project

```bash
nvm install
```

I used `web-ext` for my development environment. You can find how to install it [here](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/). However if you're using node/npm then run.

```bash
npm install --global web-ext
```

Then run the following to open up the environment

```bash
web-ext run
```

### Styling

I'm using tailwindcss to style my extension, so we'll need to generate the css. This will take the `input.css` and generates the `output.css`. Run the following command in the root project.

```bash
npm run tailwind
```

## Layout

Using the following command

```bash
tree -I ".git|node_modules"
```

You'll get the structure of the project. Let's run it down.

- The `background` dir has a **background.js** file to control whether the extension is enabled or not based on the URL.
- The `content_scripts` dir has a **content.js** file to set the video playback and watches the DOM for a next/new video.
- The `popup` dir has files to control the look and behaviour of the extension.
