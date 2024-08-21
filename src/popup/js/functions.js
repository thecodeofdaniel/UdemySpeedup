// What's this do?: These are common functions used throughout the popup.
//                  The first two are used to grab values from local storage.
//                  The rest are used for sending messages to content_scripts.
//                  and the type of data they carry. In this case objects.

/**
 * Gets videoSpeed from local storage.
 * @returns {Promise<number>}
 */
function LS_videoSpeed() {
  return browser.storage.local.get(VIDEO_SPEED_KEY).then((result) => {
    if (result[VIDEO_SPEED_KEY] === undefined) {
      return DEFAULT_SPEED;
    }

    return result[VIDEO_SPEED_KEY];
  });
}

/**
 * This sends data to the popup listener.
 * @param {object} obj
 * @returns {void}
 */
function sendMessage(obj) {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      let activeTab = tabs[0];
      return browser.tabs.sendMessage(activeTab.id, obj);
    });
}

function sendKeyVal(key, val) {
  const obj = {};
  obj[key] = val;
  sendMessage(obj);
}
