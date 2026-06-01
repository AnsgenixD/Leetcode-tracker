// background.js
const DASHBOARD_URLS = [
  "http://localhost:3000/*",
  "https://leetcode-tracker-steel.vercel.app/*"  // ← add your real URL when you deploy
];

let dashboardTabId = null;

// Watch for the dashboard tab being opened
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isDashboard = DASHBOARD_URLS.some(pattern => {
      const regex = pattern.replace('*', '.*');
      return new RegExp(regex).test(tab.url);
    });
    if (isDashboard) dashboardTabId = tabId;
  }
});

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "NEW_PROBLEM") {
    // Try localhost first (dev), fall back to content script relay (prod)
    fetch("http://localhost:3000/api/problem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    })
    .then((res) => {
      console.log("[Background] Dev server responded:", res.status);
    })
    .catch(() => {
      // Localhost not available — we're in production, use content script
      console.log("[Background] Dev server unavailable, relaying via content script...");
      if (dashboardTabId) {
        browser.tabs.sendMessage(dashboardTabId, message);
      } else {
        console.warn("[Background] No dashboard tab found either!");
      }
    });
  }
});