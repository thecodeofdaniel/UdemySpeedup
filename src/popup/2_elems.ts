// What's this?: Grabs the elements from popup.html

export interface ElementMap {
  speedRangeInputElem: HTMLInputElement;
  speedTextInputElem: HTMLInputElement;
  checkboxElem: HTMLInputElement;
  skipIntroElem: HTMLInputElement;
  skipOutroElem: HTMLInputElement;
  settingsBtnElem: HTMLButtonElement;
  skipInOutSectionElem: HTMLElement;
}

export const elements: ElementMap = {
  speedRangeInputElem: document.querySelector('input#speedRangeInput')!,
  speedTextInputElem: document.querySelector('input#speedTextInput')!,
  checkboxElem: document.querySelector('input#skipUpNextCheckbox')!,
  skipIntroElem: document.querySelector('input#skipIntro')!,
  skipOutroElem: document.querySelector('input#skipOutro')!,
  settingsBtnElem: document.querySelector('button#openSettings')!,
  skipInOutSectionElem: document.querySelector(
    'section#skipIntroOutroSection',
  )!,
};

export function getElement<K extends keyof ElementMap>(name: K): ElementMap[K] {
  return elements[name];
}
