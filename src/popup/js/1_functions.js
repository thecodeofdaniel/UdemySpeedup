// What's this?: These are functions used throughout the popup.

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

/**
 * Convert a key value pair into an object to send message
 * @param {string} key
 * @param {any} val
 */
function sendKeyVal(key, val) {
  const obj = {};
  obj[key] = val;
  sendMessage(obj);
}
