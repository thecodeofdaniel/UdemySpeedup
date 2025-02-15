import { roundUp, toNumber } from '@/global';
import {
  DEFAULT_MAX_SPEED,
  DEFAULT_MIN_SPEED,
  LSget,
  LSset,
  MAX_SPEED_KEY,
  MIN_SPEED_KEY,
  VIDEO_SPEED_KEY,
} from '@/storage';
import { sendKeyVal } from '../1_functions';
import { getElement } from '../2_elems';

export async function speedTextInputListener() {
  const speedTextInputElem = getElement('speedTextInputElem');
  const speedRangeInputElem = getElement('speedRangeInputElem');

  // Listener for input text
  speedTextInputElem.addEventListener('keypress', async (event) => {
    // Continue thru the function once the user hits "Enter"
    if (!(event.key === 'Enter')) {
      return;
    }

    // Grab the value (of type string) and remove any whitespace and trailing 'x'
    let value = toNumber(speedTextInputElem.value);

    // Gets the previous video speed from local storage
    const prevVideoSpeed = (await LSget(VIDEO_SPEED_KEY)) as number | undefined;

    // If not a number DO NOT continue
    if (value === null) {
      speedTextInputElem.value = `${prevVideoSpeed}x`;
      return;
    }

    // Round up value to two decimal places
    value = roundUp(value);

    if (!value) return;

    const maxSpeed = (await LSget(MAX_SPEED_KEY)) || DEFAULT_MAX_SPEED;
    const minSpeed = (await LSget(MIN_SPEED_KEY)) || DEFAULT_MIN_SPEED;

    // Check if speed is out of bounds
    if (value < minSpeed) {
      value = minSpeed;
    } else if (value > maxSpeed) {
      value = maxSpeed;
    }

    // If the new video speed is the same as old, then don't continue
    if (value === prevVideoSpeed) return;

    LSset(VIDEO_SPEED_KEY, value);
    speedRangeInputElem.value = value.toString();
    speedTextInputElem.value = `${value}x`;
    sendKeyVal(VIDEO_SPEED_KEY, value);
  });
}
