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

// ========== FIXED #7: Concurrent fetch + guaranteed tab messaging ==========
async function handleNewProblem(message) {
  if (!dashboardTabId) {
    console.warn("[Background] No dashboard tab found!");
    return;
  }

  try {
    // Get tab info to check if localhost
    const tab = await browser.tabs.get(dashboardTabId).catch(() => null);
    
    if (!tab) {
      console.warn("[Background] Dashboard tab lookup failed, relaying to last known tab...");
      await sendToDashboard(message);
      return;
    }

    const isLocal = tab.url && tab.url.startsWith("http://localhost");

    // Always send the tab message - this is guaranteed and critical for UI sync
    const tabMessagePromise = sendToDashboard(message);

    // If on localhost, also attempt server POST concurrently (non-blocking)
    if (isLocal) {
      console.log("[Background] Dev mode: POSTing to localhost server concurrently...");
      fetch("http://localhost:3000/api/problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.payload),
      })
        .then((res) => {
          console.log("[Background] Localhost server responded:", res.status);
        })
        .catch((err) => {
          console.warn("[Background] Localhost POST failed (non-critical):", err.message);
          // Non-blocking error - tab message already sent
        });
    } else {
      console.log("[Background] Production mode: Tab message relayed to Vercel dashboard");
    }

    // Wait for tab message to complete before returning
    await tabMessagePromise;
  } catch (err) {
    console.error("[Background] handleNewProblem error:", err.message);
  }
}

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "REGISTER_DASHBOARD") {
    dashboardTabId = sender.tab.id;
    console.log("[Background] Dashboard self-registered from tab", dashboardTabId);
  }

  if (message.type === "NEW_PROBLEM") {
    // Always handle tab messaging first, with optional concurrent server fetch
    handleNewProblem(message).catch(err => {
      console.error("[Background] Final error in handleNewProblem:", err.message);
    });
  }
});
