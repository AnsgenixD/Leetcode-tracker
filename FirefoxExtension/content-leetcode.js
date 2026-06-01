// content-leetcode.js
const url = window.location.href;
if (url.includes('leetcode.com/problems/')) {
    browser.runtime.sendMessage({ 
        type: "NEW_PROBLEM", 
        payload: { url: url, timestamp: Date.now() } 
    });
}