// background.js
const DASHBOARD_URLS = [
  "http://localhost:3000/",
  "https://leetcode-tracker-steel.vercel.app/"
];

let dashboardTabId = null;

function isDashboardUrl(url) {
  return DASHBOARD_URLS.some(base => url.startsWith(base));
}

// Check if dashboard is already open when extension loads
browser.tabs.query({}).then((tabs) => {
  const dashboard = tabs.find(t => t.url && isDashboardUrl(t.url));
  if (dashboard) {
    dashboardTabId = dashboard.id;
    console.log("[Background] STARTUP: Found existing dashboard tab", dashboardTabId);
  }
});

// Watch for dashboard tab being opened or navigated to
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && isDashboardUrl(tab.url)) {
    dashboardTabId = tabId;
    console.log("[Background] UPDATED: Dashboard tab registered", dashboardTabId);
  }
});

// Also catch if user switches to an already-loaded dashboard tab
browser.tabs.onActivated.addListener(({ tabId }) => {
  browser.tabs.get(tabId).then((tab) => {
    if (tab.url && isDashboardUrl(tab.url)) {
      dashboardTabId = tabId;
      console.log("[Background] ACTIVATED: Dashboard tab registered", tabId);
    }
  });
});

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "NEW_PROBLEM") {
    fetch("http://localhost:3000/api/problem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    })
    .then((res) => {
      console.log("[Background] Dev server responded:", res.status);
    })
    .catch(() => {
      console.log("[Background] Dev server unavailable, relaying via content script...");
      if (dashboardTabId) {
        browser.tabs.sendMessage(dashboardTabId, message)
          .then(() => console.log("[Background] Relayed to dashboard tab", dashboardTabId))
          .catch((err) => console.error("[Background] Failed to relay:", err.message));
      } else {
        console.warn("[Background] No dashboard tab found!");
      }
    });
  }
});