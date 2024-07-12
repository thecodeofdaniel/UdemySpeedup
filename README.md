# Udemy Speedup

![UdemySpeedup Extension](./imgs/extension.png)

This extension adds playback rates to Udemy videos. Ranging from 0.5x to 4x speed.
The user can either use the range input or the text input for finer control if they so choose. They can also use the `[` and `]` keys to quickly change playback by 0.25 speed.

**NOTE**: It may not apply at times, if that happens just refresh the page.

## Steps to build/edit extension

Install NodeJS (LTS) version 20. However if you use nvm, you can use the `.nvmrc` file to get my exact node version. Run the following command within the project

```bash
nvm install
```

I used `web-ext` for my development environment. You can find how to install it [here](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/). However if you're already using node/npm then run.

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

- The `background` dir has a **background.js**. It has 3 responsibilities.
  - To control whether the extension is enabled or not based on the URL.
  - Listens when the user enters a shortcut. Telling the popup.js to correctly reflect the new playback speed.
  - Update the playback text on screen when the user clicks onto a new Udemy tab.
    - It does this by running the content script **3_update.js**.
- The `content_scripts` dir has 4 scripts. Going from 1 to 4 in this order.
  - The first file **1_shared.js** has some variables that are used by everybody inside this dir. It also contains a function to get elements once they've rendered.
  - The second file **2_content.js** applys the playback speed to the video and watches for a new video.
  - The third file **3_update.js** reflects the playback rate to the user onto the DOM.
  - The fourth file **4_shorcuts.js** adds an event listener to listen for when the user enters the shortcut keys.
- The `popup` dir has files to control the look and behaviour of the extension. It also has listeners to hear from **2_content.js** to reflect back the correct video speed. As well as the ability to change the video playback speed.
