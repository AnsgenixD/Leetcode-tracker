// background.js
const DASHBOARD_URLS = [
  "http://localhost:3000",
  "https://leetcode-tracker-steel.vercel.app"
];

let dashboardTabId = null;

function isDashboardUrl(url) {
  if (!url) return false;
  // Exclude API calls or backend routes that shouldn't match
  if (url.includes("/api/")) return false;
  // Normalize URL by stripping trailing slash
  const cleanUrl = url.replace(/\/$/, "");
  return DASHBOARD_URLS.some(base => cleanUrl.startsWith(base));
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

async function sendMessageWithRetry(tabId, message, maxRetries = 3, initialDelay = 100) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await browser.tabs.sendMessage(tabId, message);
      console.log(`[Background] SUCCESS: Relayed to tab ${tabId} on attempt ${attempt + 1}`);
      return;
    } catch (err) {
      attempt++;
      const isConnectionError = err.message && (
        err.message.includes("Could not establish connection") || 
        err.message.includes("Receiving end does not exist")
      );
      
      console.warn(`[Background] Attempt ${attempt} failed for tab ${tabId}: ${err.message}`);
      
      if (isConnectionError && attempt === 1) {
        console.log(`[Background] Connection failed for tab ${tabId}. Attempting dynamic content script injection...`);
        try {
          await browser.scripting.executeScript({
            target: { tabId },
            files: ["content-dashboard.js"]
          });
          // Small delay to allow listener to register
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (injectErr) {
          console.error(`[Background] Dynamic injection failed for tab ${tabId}:`, injectErr.message);
        }
      }
      
      if (attempt < maxRetries) {
        const backoffDelay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`[Background] Retrying tab ${tabId} in ${backoffDelay}ms (Attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      } else {
        console.error(`[Background] Failed to relay to tab ${tabId} after ${maxRetries} attempts.`);
        throw err;
      }
    }
  }
}

async function sendToDashboard(message) {
  try {
    const tabs = await browser.tabs.query({});
    const dashboardTabs = tabs.filter(t => t.url && isDashboardUrl(t.url));

    const targets = [];
    if (dashboardTabs.length > 0) {
      dashboardTabs.forEach(tab => targets.push(tab.id));
    } else if (dashboardTabId) {
      targets.push(dashboardTabId);
    }

    if (targets.length === 0) {
      console.warn("[Background] No dashboard tab found!");
      return;
    }

    // De-duplicate target tab IDs
    const uniqueTargets = [...new Set(targets)];

    // Send concurrently to all unique targets
    await Promise.allSettled(
      uniqueTargets.map(tabId => sendMessageWithRetry(tabId, message))
    );
  } catch (err) {
    console.error("[Background] Failed in sendToDashboard query/relay:", err.message);
  }
}

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "REGISTER_DASHBOARD") {
    dashboardTabId = sender.tab.id;
    console.log("[Background] Dashboard self-registered from tab", dashboardTabId);
  }

  if (message.type === "NEW_PROBLEM") {
    // 1. Immediately send direct tab message to the dashboard, decoupled from API fetch
    sendToDashboard(message);

    // 2. Independently attempt local API POST if localhost is in use
    browser.tabs.query({}).then((tabs) => {
      const hasLocalhostDashboard = tabs.some(tab => tab.url && tab.url.startsWith("http://localhost")) || 
        (dashboardTabId && tabs.some(tab => tab.id === dashboardTabId && tab.url && tab.url.startsWith("http://localhost")));

      if (hasLocalhostDashboard) {
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
          console.error("[Background] Localhost POST failed:", err.message);
        });
      } else {
        console.log("[Background] Production mode: Skipped localhost POST (no localhost dashboard tab found).");
      }
    }).catch((err) => {
      console.warn("[Background] Tab query failed for localhost check, attempting localhost POST anyway just in case...", err.message);
      if (dashboardTabId) {
        browser.tabs.get(dashboardTabId).then(tab => {
          if (tab.url && tab.url.startsWith("http://localhost")) {
            console.log("[Background] Dev mode (fallback): POSTing to localhost server...");
            fetch("http://localhost:3000/api/problem", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(message.payload),
            })
            .then((res) => {
              console.log("[Background] Localhost server responded:", res.status);
            })
            .catch((fetchErr) => {
              console.error("[Background] Localhost POST failed:", fetchErr.message);
            });
          }
        }).catch(() => {});
      }
    });
  }
});
