// content-dashboard.js
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "NEW_PROBLEM") {
    document.dispatchEvent(
      new CustomEvent("leetcode:problem", { detail: message.payload })
    );
  }
});