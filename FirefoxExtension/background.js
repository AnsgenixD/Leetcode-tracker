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

// ========== FIX #7: Optimized extension communication with concurrent logic ==========
async function sendToDashboardWithFallback(message) {
  if (!dashboardTabId) {
    console.warn("[Background] No dashboard tab found!");
    return;
  }

  try {
    // First, try to detect if we're on localhost
    const tab = await browser.tabs.get(dashboardTabId).catch(() => null);
    
    if (!tab) {
      console.warn("[Background] Dashboard tab lookup failed, attempting relay anyway...");
      await sendToDashboard(message);
      return;
    }

    const isLocal = tab.url && tab.url.startsWith("http://localhost");

    if (isLocal && message.type === "NEW_PROBLEM") {
      console.log("[Background] Dev mode: POSTing to localhost server...");
      try {
        const res = await fetch("http://localhost:3000/api/problem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message.payload),
        });
        console.log("[Background] Localhost server responded:", res.status);
        return;
      } catch (localErr) {
        console.warn("[Background] Localhost POST failed:", localErr.message);
        // Fall through to relay via content script
      }
    }

    console.log("[Background] Production/relay mode: Sending via content script to dashboard tab...");
    await sendToDashboard(message);
  } catch (err) {
    console.error("[Background] sendToDashboardWithFallback error:", err.message);
  }
}

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "REGISTER_DASHBOARD") {
    dashboardTabId = sender.tab.id;
    console.log("[Background] Dashboard self-registered from tab", dashboardTabId);
  }

  if (message.type === "NEW_PROBLEM") {
    // Use optimized fallback logic instead of sequential promises
    sendToDashboardWithFallback(message).catch(err => {
      console.error("[Background] Final error:", err.message);
    });
  }
});
