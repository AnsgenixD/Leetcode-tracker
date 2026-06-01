// background.js
const DASHBOARD_URLS = [
  "http://localhost:3000/",
  "https://leetcode-tracker-steel.vercel.app/"
];

let dashboardTabId = null;

function isDashboardUrl(url) {
  return DASHBOARD_URLS.some(base => url.startsWith(base));
}

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "REGISTER_DASHBOARD") {
    dashboardTabId = sender.tab.id;
    console.log("[Background] Dashboard self-registered from tab", dashboardTabId);
  }
  // ... rest of listener
});

browser.tabs.query({}).then((tabs) => {
  const dashboard = tabs.find(t => t.url && isDashboardUrl(t.url));
  if (dashboard) {
    dashboardTabId = dashboard.id;
    console.log("[Background] STARTUP: Found existing dashboard tab", dashboardTabId);
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && isDashboardUrl(tab.url)) {
    dashboardTabId = tabId;
    console.log("[Background] UPDATED: Dashboard tab registered", dashboardTabId);
  }
});

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
    // Force inject the content script first, ignore error if already injected
    await browser.scripting.executeScript({
      target: { tabId: dashboardTabId },
      files: ["content-dashboard.js"],
    }).catch(() => {
      // Already injected, that's fine
    });

    // Small delay to let the script initialize
    await new Promise(r => setTimeout(r, 100));

    await browser.tabs.sendMessage(dashboardTabId, message);
    console.log("[Background] Relayed to dashboard tab", dashboardTabId);
  } catch (err) {
    console.error("[Background] Failed to relay:", err.message);
  }
}

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
      sendToDashboard(message);
    });
  }
});