// What's this?: These are css selectors to select the elements needed.

// Selectors
const VIDEO_SELECTOR = "video[class*='video-player--video-player']";
const PLAYBACK_TEXT_SELECTOR = "span[class*='playback-rate--trigger-text']";
const PROGRESS_BAR_SELECTOR = '.progress-bar--slider--z064U';
const NEXT_BUTTON_SELECTOR = '#go-to-next-item';
const PLAYBACK_POPUP_SELECTOR = '.playback-rate--menu--4b1Qm';

// Elements
/** @type {Element|null} */
let videoElem = null;

/** @type {Element|null} */
let playBackTextElem = null;

/** @type {Element|null} */
let progressBarElem = null;

/** @type {Element|null} */
let nextButtonElem = null;

/** @type {Element|null} */
let playbackPopupElem = null;
