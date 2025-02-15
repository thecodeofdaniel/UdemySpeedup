import { waitForElement } from '../lib/funcs';
import { setElement } from '../lib/elems';

/** Finds the "next video" button element */
export async function findNextVidBtn() {
  const nextButtonElem = await waitForElement('nextButtonElem');

  if (nextButtonElem === null) return;

  setElement('nextButtonElem', nextButtonElem);
}
