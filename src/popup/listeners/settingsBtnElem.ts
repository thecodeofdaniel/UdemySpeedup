import { getElement } from '../2_elems';

export async function settingsBtnElemListener() {
  const settingsBtnElem = getElement('settingsBtnElem');

  settingsBtnElem.addEventListener('click', (e) => {
    e.preventDefault();
    browser.runtime.openOptionsPage();
    window.close();
  });
}
