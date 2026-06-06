// background.js
const DASHBOARD_URLS = [
  "http://localhost:3000/",
  "https://leetcode-tracker-steel.vercel.app/"
];

let dashboardTabId = null;

function isDashboardUrl(url) {
  return DASHBOARD_URLS.some(base => url.startsWith(base));
}

function isLocalhost() {
  return dashboardTabId !== null && (() => {
    // Check if the registered tab is localhost
    return browser.tabs.get(dashboardTabId).then(tab => 
      tab.url && tab.url.startsWith("http://localhost")
    );
  })();
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

// Catch already-loaded dashboard tab on focus
browser.tabs.onActivated.addListener(({ tabId }) => {
  browser.tabs.get(tabId).then((tab) => {
    if (tab.url && isDashboardUrl(tab.url)) {
      dashboardTabId = tabId;
      console.log("[Background] ACTIVATED: Dashboard tab registered", tabId);
    }
  });
});

async function sendToDashboard(message) {
  if (!dashboardTabId) {
    console.warn("[Background] No dashboard tab found!");
    return;
  }

  try {
    await browser.tabs.sendMessage(dashboardTabId, message);
    console.log("[Background] SUCCESS: Relayed to dashboard tab", dashboardTabId);
  } catch (err) {
    console.error("[Background] Failed to relay:", err.message);
  }
}

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "REGISTER_DASHBOARD") {
    dashboardTabId = sender.tab.id;
    console.log("[Background] Dashboard self-registered from tab", dashboardTabId);
  }

  if (message.type === "NEW_PROBLEM") {
    // Only try localhost POST when dashboard is on localhost
    browser.tabs.get(dashboardTabId).then(tab => {
      const isLocal = tab.url && tab.url.startsWith("http://localhost");

      if (isLocal) {
        console.log("[Background] Dev mode: POSTing to localhost server...");
        fetch("http://localhost:3000/api/problem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message.payload),
        })
        .then((res) => {
          console.log("[Background] Localhost server responded:", res.status);
        })
        .catch((err) => {
          console.warn("[Background] Localhost POST failed, falling back to content script:", err.message);
          sendToDashboard(message);
        });
      } else {
        console.log("[Background] Production mode: Relaying via content script to Vercel tab...");
        sendToDashboard(message);
      }
    }).catch(() => {
      // dashboardTabId is stale, fall back
      console.warn("[Background] Dashboard tab lookup failed, attempting relay anyway...");
      sendToDashboard(message);
    });
  }
});
