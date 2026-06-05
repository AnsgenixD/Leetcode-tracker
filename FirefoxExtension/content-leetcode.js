// content-leetcode.js


function createReviewOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'leetedge-review-overlay';
  overlay.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    background-color: #2d2d2d;
    border: 1px solid #3a3a3a;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const question = document.createElement('p');
  question.textContent = 'How was this problem?';
  question.style.cssText = `
    margin: 0;
    color: #eff1f6;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  `;

  const buttonRow = document.createElement('div');
  buttonRow.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: center;
  `;

  const buttons = [
    { label: 'Again', color: '#ef4743' },
    { label: 'Hard',  color: '#ffa116' },
    { label: 'Good',  color: '#02b128' },
    { label: 'Easy',  color: '#2cbbf0' },
  ];

  buttons.forEach(({ label, color }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
      background-color: transparent;
      border: 1px solid ${color};
      color: ${color};
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease; /* Changed to 'all' */
      flex: 1;
    `;
    
    // Changed to Solid Fill for better UX
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = color;
      btn.style.color = '#ffffff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = 'transparent';
      btn.style.color = color;
    });
    
    btn.addEventListener('click', () => {
      console.log(`[LeetEdge] Review rating: ${label}`);
      
      // 1. Get the current URL
      let currentUrl = window.location.href;
      
      // 2. Clean it up (remove 'submissions/' so the dashboard gets the base problem link)
      let cleanUrl = currentUrl.split('/submissions/')[0] + '/';
      
      // 3. Send the full payload WITH the user's rating!
      browser.runtime.sendMessage({ 
          type: "NEW_PROBLEM", 
          payload: { 
            url: cleanUrl, 
            timestamp: Date.now(),
            rating: label  // "Again", "Hard", "Good", or "Easy"
          } 
      });
      
      // 4. Hide the overlay
      overlay.remove();
    });
    buttonRow.appendChild(btn);
  });

  const dismissBtn = document.createElement('button');
  dismissBtn.textContent = '✕';
  dismissBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 10px;
    background: none;
    border: none;
    color: #6b6b6b;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `;
  dismissBtn.addEventListener('click', () => overlay.remove());

  overlay.appendChild(dismissBtn);
  overlay.appendChild(question);
  overlay.appendChild(buttonRow);
  document.body.appendChild(overlay);

  return overlay;
}

let lastUrl = '';

function checkUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    if (currentUrl.includes('/submissions/')) {
      if (!document.getElementById('leetedge-review-overlay')) {
        createReviewOverlay();
      }
    }
  }
}

// Run immediately and set up polling for SPA transitions
checkUrlChange();
setInterval(checkUrlChange, 500);