// What's this?: Adds event listeners to elements

import { speedRangeInputElemListener } from './listeners/speedRangeInputElem';
import { speedTextInputListener } from './listeners/speedTextInputElem';
import { checkboxElemListener } from './listeners/checkboxElem';
import { skipIntroOutroElemsListeners } from './listeners/skipIntroOutroElems';
import { settingsBtnElemListener } from './listeners/settingsBtnElem';

/** Initialize all event listeners for the popup */
export async function initListeners() {
  speedTextInputListener();
  speedRangeInputElemListener();
  checkboxElemListener();
  skipIntroOutroElemsListeners();
  settingsBtnElemListener();
}
