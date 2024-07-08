// What's this do?: It controls whether the extension is enabled based on the
//                  URL they're on. Should be enabled when they're on the Udemy
//                  website.

// NOTE: To view the console you need to visit about:debugging. Navigate to the
//       extension and click on "Inspect".

const UDEMY_URL = 'https://www.udemy.com';

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

// Listen for tab activations and update extension state
browser.tabs.onActivated.addListener((activeInfo) => {
  logCurrentTabUrl();
});

// Run on startup
logCurrentTabUrl();
