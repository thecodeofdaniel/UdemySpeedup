import { SKIP_INTRO_KEY, SKIP_OUTRO_KEY } from '@/storage';
import { getCourseName } from '../0_course_name';
import { saveSkipValue } from '../1_functions';
import { getElement } from '../2_elems';

export async function skipIntroOutroElemsListeners() {
  const courseName = getCourseName();
  const skipInOutSectionElem = getElement('skipInOutSectionElem');
  const skipIntroElem = getElement('skipIntroElem');
  const skipOutroElem = getElement('skipOutroElem');

  if (courseName === null) {
    skipInOutSectionElem.style.display = 'none';
  } else {
    // Sets and saves skip intro value
    skipIntroElem.addEventListener('keypress', (event) =>
      saveSkipValue(event, SKIP_INTRO_KEY),
    );

    // Sets and saves skip outro value
    skipOutroElem.addEventListener('keypress', (event) =>
      saveSkipValue(event, SKIP_OUTRO_KEY),
    );
  }
}
