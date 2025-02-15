// What's this?: Global variables for content scripts

import { extractCourseName } from '@/global';
import { getLectureId } from './funcs';

export interface GlobalVarMap {
  currentLectureId: number | null;
  courseName: string | null;
  progressBarObserver: MutationObserver | null;
}

const globalVars: GlobalVarMap = {
  currentLectureId: getLectureId(location.href),
  courseName: extractCourseName(window.location.href),
  progressBarObserver: null,
};

export function getGlobalVar<K extends keyof GlobalVarMap>(
  name: K,
): GlobalVarMap[K] {
  return globalVars[name] as GlobalVarMap[K];
}

export function setGlobalVar<K extends keyof GlobalVarMap>(
  name: K,
  globalVar: GlobalVarMap[K],
): GlobalVarMap[K] {
  globalVars[name] = globalVar;
  return globalVars[name] as GlobalVarMap[K];
}

// Gets copy of globalCurrentLectureId since its a primitive
export function getGlobalCurrentLectureId(): GlobalVarMap['currentLectureId'] {
  return globalVars['currentLectureId'];
}
