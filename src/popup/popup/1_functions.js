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

/** Saves the skip value for intro and outro into local storage
 * @param {event} event
 * @param {string} key
 */
function saveSkipValue(event, key) {
  if (!(event.key === 'Enter')) {
    return;
  }

  // Grab the value (of type string) and remove any whitespace and trailing 'x'
  let seconds = toNumber(event.target.value);

  // If not a number DO NOT continue
  if (seconds === null || seconds < 0) {
    return;
  }

  browser.storage.local.get(key, (result) => {
    let value = result[key];
    let obj = value !== undefined ? value : {};
    obj[courseName] = +seconds.toFixed(1);
    LSset(key, obj);
  });
}

/**
 * Sets the skip value for intro and outro if it doesn't exist
 * @param {object} result
 * @param {Element} elem
 * @param {string} key
 */
function initSkipValue(result, elem, key) {
  let obj = result[key];
  let elemValue;

  console.log(obj);

  // If value is defined
  if (obj && obj[courseName] !== undefined) {
    elemValue = obj[courseName];
  } else {
    let innerObj = obj !== undefined ? obj : {};
    innerObj[courseName] = DEFAULT_SKIP_INOUTRO;
    elemValue = DEFAULT_SKIP_INOUTRO;
    LSset(key, innerObj);
  }

  elem.value = elemValue;
}
