import { LSset, VIDEO_SPEED_KEY } from '@/storage';
import { sendKeyVal } from '../1_functions';
import { getElement } from '../2_elems';

export async function speedRangeInputElemListener() {
  const speedRangeInputElem = getElement('speedRangeInputElem');
  const speedTextInputElem = getElement('speedTextInputElem');

  // Listener for range (slider) input
  speedRangeInputElem.addEventListener('input', () => {
    let value = +speedRangeInputElem.value;

    LSset(VIDEO_SPEED_KEY, value);
    speedTextInputElem.value = `${value}x`;
    sendKeyVal(VIDEO_SPEED_KEY, value);
  });
}
