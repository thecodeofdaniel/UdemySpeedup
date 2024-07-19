// What's this do?: These are common functions used throughout the popup.
//                  The first two are used to grab values from local storage.
//                  The rest are used for sending messages to content_scripts.
//                  and the type of data they carry. In this case objects.

/**
 * Gets videoSpeed from local storage.
 * @returns {string}
 */
function LS_videoSpeed() {
  let videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;

  if (!videoSpeed) {
    videoSpeed = DEFAULT_SPEED.toString();
    localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
  }

  return videoSpeed;
}

/**
 * Gets checkbox value from local storage
 * @returns {"true"|"false"}
 */
function LS_checkboxValue() {
  let isChecked = localStorage.getItem(SKIP_DELAY_KEY) || null;

  if (!isChecked) {
    isChecked = DEFAULT_CHECKBOX_VALUE.toString();
    localStorage.setItem(SKIP_DELAY_KEY, isChecked);
  }

  return isChecked;
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

/**
 * Sends the video speed object. Dictates whether value is newly set.
 * @param {boolean} isSet
 * @returns {object}
 */
function videoSpeedObj(isSet) {
  return {
    newSpeedValue: isSet,
    videoSpeed: LS_videoSpeed(),
  };
}

/**
 * Sends the checkbox object. Dictates whether value is newly set.
 * @param {boolean} isSet
 * @returns {object}
 */
function checkboxValObj(isSet) {
  return {
    newCheckboxValue: isSet,
    checkboxValue: LS_checkboxValue(),
  };
}
