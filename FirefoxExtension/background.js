// background.js
browser.runtime.onMessage.addListener((message, sender) => {
  console.log(`[Background] Heard '${message.type}' from`, sender.tab?.url);

  if (message.type === "NEW_PROBLEM") {
    console.log("[Background] POSTing to localhost...", message.payload);

    fetch("http://localhost:3000/api/problem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    })
      .then((res) => {
        console.log("[Background] Server responded:", res.status);
      })
      .catch((err) => {
        console.error("[Background] Fetch FAILED:", err.message);
      });
  }
});