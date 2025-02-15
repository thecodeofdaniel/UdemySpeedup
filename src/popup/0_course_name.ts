// What's this?: Grabs the current course name from the URL

import { extractCourseName } from '@/global';

let courseName: string | null = null;

export function getCourseName(): string | null {
  return courseName;
}

export async function initCourseName(): Promise<void> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;
  courseName = url ? extractCourseName(url) : null;
}
