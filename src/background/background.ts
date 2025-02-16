// What's this?: It controls whether the extension is enabled based on the URL
//               they're on. Should be enabled when they're Udemy lecture. It
//               also runs a content script when clicking on a different tab.
//               Updating the playback text.
// NOTE:         To view the console on the extension side. You need to visit
//               about:debugging. Click "This Firefox" > "Inspect".

import { UDEMY_VIDEO_URL_PATTERN } from '@/global';

/** Checks if extension should be enabled or not and returns a boolean */
async function checkAndToggleExtension(): Promise<boolean> {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tabs.length === 0) return false;

    const { url: tabUrl, id: tabId } = tabs[0];

    if (tabUrl && UDEMY_VIDEO_URL_PATTERN.test(tabUrl)) {
      browser.browserAction.enable(tabId);
      return true;
    } else {
      browser.browserAction.disable(tabId);
      return false;
    }
  } catch (error) {
    console.error('Error fetching tab information:', error);
    return false;
  }
}

async function handleTabActivation(tabId: number) {
  // Simply send the message to the tab to update playback text
  await browser.tabs.sendMessage(tabId, {
    type: 'UPDATE_PLAYBACK_TEXT',
  });
}

// Listen for tab URL changes and update extension state
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // Check for both URL changes and when a tab completes loading
  if (changeInfo.url || changeInfo.status === 'complete') {
    checkAndToggleExtension();
  }
});

// Listen for tab activations and update extension state and execute script
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const isOnUdemyLecture = await checkAndToggleExtension();

  if (isOnUdemyLecture) {
    handleTabActivation(activeInfo.tabId);
  }
});

// Run on startup
checkAndToggleExtension();
