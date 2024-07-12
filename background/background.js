// What's this do?: It controls whether the extension is enabled based on the
//                  URL they're on. Should be enabled when they're on the Udemy
//                  website.

// NOTE: To view the console you need to visit about:debugging. Navigate to the
//       extension and click on "Inspect".

// Enable or disable extension depending if they're on the correct URL
function logCurrentTabUrl() {
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        // Check if the URL starts with a specific string
        if (tabs[0].url.startsWith(UDEMY_URL)) {
          // Enable extension features for this site
          browser.browserAction.enable(tabs[0].id);
        } else {
          // Disable extension features for other sites
          browser.browserAction.disable(tabs[0].id);
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching tab information:', error);
    });
}

// Listen for tab URL changes and update extension state
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    logCurrentTabUrl();
  }
});

// Function to execute the content script in a given tab
function executeContentScript(tabId) {
  browser.tabs
    .executeScript(tabId, { file: '/content_scripts/3_update.js' })
    .catch((error) =>
      console.error(`Failed to execute content script: ${error}`),
    );
}

// Listen for tab activations and update extension state and execute script
browser.tabs.onActivated.addListener((activeInfo) => {
  logCurrentTabUrl();

  browser.tabs
    .get(activeInfo.tabId)
    .then((tab) => {
      if (tab.url.includes(UDEMY_URL)) {
        executeContentScript(activeInfo.tabId);
      }
    })
    .catch((error) => console.error(`Failed to get active tab: ${error}`));
});

// Run on startup
logCurrentTabUrl();

// Listen for messages from the content script "shortcuts.js"
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  localStorage.setItem('videoSpeed', request.speed);
});
