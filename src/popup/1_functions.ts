// What's this?: These are functions used throughout the popup

import {
  DEFAULT_SKIP_INOUTRO,
  LSset,
  SKIP_INTRO_KEY,
  SKIP_OUTRO_KEY,
  StorageKeyMap,
} from '@/storage';
import { toNumber } from '@/global';
import { getCourseName } from './0_course_name';

type SkipKey = typeof SKIP_INTRO_KEY | typeof SKIP_OUTRO_KEY;

/** This sends data to the popup listener */
async function sendMessage(obj: object) {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      let activeTab = tabs[0];

      if (activeTab.id) {
        return browser.tabs.sendMessage(activeTab.id, obj);
      }
    });
}

/** Convert a key value pair into an object to send message */
export function sendKeyVal(key: string, val: any) {
  const courseName = getCourseName();

  if (courseName === null) return;

  const obj: { [key: string]: any } = {};
  obj[key] = val;
  sendMessage(obj);
}

/** Saves the skip value for intro and outro into local storage */
export function saveSkipValue(event: KeyboardEvent, key: SkipKey) {
  const courseName = getCourseName();

  if (courseName === null) return;
  if (!(event.key === 'Enter')) return;

  // Grab the value (of type string) and remove any whitespace and trailing 'x'
  let seconds = toNumber((event.target as HTMLInputElement).value);

  // If not a number DO NOT continue
  if (seconds === null || seconds < 0) {
    return;
  }

  browser.storage.local.get([key]).then((result: { [key: string]: any }) => {
    let value = result[key];
    let obj = value !== undefined ? value : {};
    obj[courseName] = +seconds.toFixed(1);
    LSset(key, obj);
  });
}

/** Sets the skip value for intro and outro if it doesn't exist */
export function initSkipValue(
  result: { [key: string]: { [courseName: string]: number } },
  elem: HTMLInputElement,
  key: SkipKey,
) {
  const courseName = getCourseName()!;
  const skipObj = result[key];
  let skipValue = DEFAULT_SKIP_INOUTRO.toString();

  if (courseName) {
    // If value is defined
    if (skipObj && skipObj[courseName] !== undefined) {
      skipValue = skipObj[courseName].toString();
    } else {
      let innerObj = skipObj !== undefined ? skipObj : {};
      innerObj[courseName] = DEFAULT_SKIP_INOUTRO;
      LSset(key, innerObj);
    }
  }

  elem.value = skipValue;
}
