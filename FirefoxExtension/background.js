// background.js
const DASHBOARD_URLS = [
  "http://localhost:3000/",
  "https://leetcode-tracker-steel.vercel.app/"
];

let dashboardTabId = null;
let registeredDashboardTabId = null; // Track verified registered tabs

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
    registeredDashboardTabId = null; // Reset registration on page load
    console.log("[Background] UPDATED: Dashboard tab found", dashboardTabId);
  }
});

// Catch already-loaded dashboard tab on focus
browser.tabs.onActivated.addListener(({ tabId }) => {
  browser.tabs.get(tabId).then((tab) => {
    if (tab.url && isDashboardUrl(tab.url)) {
      dashboardTabId = tabId;
      console.log("[Background] ACTIVATED: Dashboard tab accessed", tabId);
    }
  }).catch(() => {});
});

async function sendToDashboard(message) {
  if (!registeredDashboardTabId) {
    console.warn("[Background] Dashboard hasn't registered yet!");
    return false;
  }

  try {
    await browser.tabs.sendMessage(registeredDashboardTabId, message);
    console.log("[Background] SUCCESS: Relayed to dashboard tab", registeredDashboardTabId);
    return true;
  } catch (err) {
    console.error("[Background] Failed to relay to registered tab:", err.message);
    registeredDashboardTabId = null; // Reset on failure (tab might have closed)
    return false;
  }
}

// ========== FIXED #7: Robust concurrent fetch + guaranteed tab messaging with retry ==========
async function handleNewProblem(message) {
  // If dashboard registered, use it
  if (registeredDashboardTabId) {
    console.log("[Background] Using registered dashboard tab", registeredDashboardTabId);
    const sent = await sendToDashboard(message);
    
    // Get tab info to check if localhost for concurrent POST
    const tab = await browser.tabs.get(registeredDashboardTabId).catch(() => null);
    if (tab && tab.url && tab.url.startsWith("http://localhost")) {
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
        });
    }
    return sent;
  }

  // Fallback: If tab was found but not registered, try a retry mechanism
  if (dashboardTabId) {
    console.log("[Background] Dashboard tab found but not yet registered, retrying...");
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // Try to send message - if listener is now ready, it will succeed
        await browser.tabs.sendMessage(dashboardTabId, message);
        console.log("[Background] SUCCESS: Relayed to dashboard tab (retry attempt", attempt + 1, ")");
        registeredDashboardTabId = dashboardTabId; // Mark as registered
        return true;
      } catch (err) {
        if (attempt < 2) {
          console.warn("[Background] Relay attempt", attempt + 1, "failed, waiting...");
          await new Promise(resolve => setTimeout(resolve, 200 + attempt * 100));
        } else {
          console.error("[Background] All retry attempts failed:", err.message);
        }
      }
    }
  }

  console.warn("[Background] No dashboard tab available!");
  return false;
}

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from tab`, sender.tab?.id, sender.tab?.url);

  if (message.type === "REGISTER_DASHBOARD") {
    registeredDashboardTabId = sender.tab.id;
    dashboardTabId = sender.tab.id;
    console.log("[Background] ✅ Dashboard officially registered:", registeredDashboardTabId);
  }

  if (message.type === "NEW_PROBLEM") {
    // Handle with retry logic
    handleNewProblem(message).catch(err => {
      console.error("[Background] Final error in handleNewProblem:", err.message);
    });
  }
});
