import { LSget, SKIP_OUTRO_KEY, SKIP_DELAY_KEY } from '@/storage';
import { getElement } from '../lib/elems';
import { getGlobalVar, setGlobalVar } from '../lib/vars';
import { waitForElement } from '../lib/funcs';

export async function watchProgressBar() {
  const progressBarElem = await waitForElement('progressBarElem');

  if (!progressBarElem) return;

  // Create a callback function to execute when mutations are observed
  const handleChange = async (mutationsList: MutationRecord[]) => {
    // If elem doesn't exist or video is finished
    const globalVideoElem = getElement('videoElem');
    const globalNextButtonElem = getElement('nextButtonElem');
    const globalCourseName = getGlobalVar('courseName');

    if (!globalVideoElem || !globalNextButtonElem || !globalCourseName) return;

    const skipOutroObj = await LSget(SKIP_OUTRO_KEY);
    const skipOutroSeconds = skipOutroObj?.[globalCourseName] ?? 0;

    for (const mutation of mutationsList) {
      const progress = (mutation.target as Element).getAttribute(
        'aria-valuenow',
      );
      // console.log(progress);

      if (
        skipOutroSeconds <= 1 &&
        mutation.attributeName === 'aria-valuenow' &&
        progress === '100'
      ) {
        const skipDelay = await LSget(SKIP_DELAY_KEY);
        if (skipDelay) globalNextButtonElem.click();
      } else if (
        skipOutroSeconds > 1 &&
        mutation.attributeName === 'aria-valuetext' &&
        progress !== '100' &&
        globalVideoElem.currentTime !== globalVideoElem.duration
      ) {
        const newDuration = globalVideoElem.duration - skipOutroSeconds;
        // console.log(`${videoElem.currentTime} >= ${newDuration}`);

        if (globalVideoElem.currentTime >= newDuration) {
          const skipDelay = await LSget(SKIP_DELAY_KEY);
          if (skipDelay) {
            globalNextButtonElem.click();
          } else {
            // console.log('here');
            globalVideoElem.currentTime = globalVideoElem.duration;
            (mutation.target as Element).setAttribute('aria-valuenow', '100');
          }
        }
      }
    }
  };

  // PBO: Progress Bar Observer
  // This is needed since if user selects different video while watching one
  // the old observer still might be running. So disconnect b4 adding new one
  let globalPBO = getGlobalVar('progressBarObserver');

  if (globalPBO) {
    globalPBO.disconnect();
    setGlobalVar('progressBarObserver', null);
  }

  const observer = new MutationObserver(handleChange);
  globalPBO = setGlobalVar('progressBarObserver', observer) as typeof observer;

  globalPBO.observe(progressBarElem, {
    attributes: true,
    attributeFilter: ['aria-valuetext', 'aria-valuenow'],
  });
}
