import { SKIP_DELAY_KEY, LSset } from '@/storage';
import { getElement } from '../2_elems';

export async function checkboxElemListener() {
  const checkboxElem = getElement('checkboxElem');

  checkboxElem.addEventListener('change', () => {
    LSset(SKIP_DELAY_KEY, checkboxElem.checked);
  });
}
