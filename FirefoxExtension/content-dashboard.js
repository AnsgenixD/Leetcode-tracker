// content-dashboard.js
console.log("Dashboard Spy: ALIVE on", window.location.href);

browser.runtime.sendMessage({ type: "REGISTER_DASHBOARD" });

browser.runtime.onMessage.addListener((message) => {
  console.log("Dashboard Spy: Got message", message.type);
  if (message.type === "NEW_PROBLEM") {
    document.dispatchEvent(
      new CustomEvent("leetcode:problem", {
        detail: JSON.stringify(message.payload)  // ← serialize to string
      })
    );
  }
});