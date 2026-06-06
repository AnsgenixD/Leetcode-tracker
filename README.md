<div align="center">
  <h1>🧠 LeetCode Tracker</h1>
  <p><strong>Intelligent spaced repetition for LeetCode problems with a decoupled Firefox extension</strong></p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-95.6%25-blue)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-Dashboard-61dafb)](https://react.dev/)
  [![Firefox](https://img.shields.io/badge/Firefox-Extension-FF7139)](https://www.mozilla.org/)
  [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
</div>

---

## The Problem

Mastering DSA requires **spaced repetition**—but the current solutions are broken:

- **LeetHub & DOM Scrapers**: Extract brittle selectors from LeetCode's HTML. Every CSS update breaks the extension, and you lose weeks of progress waiting for a fix.
- **Anki Manual Entry**: Requires copying problem details by hand—tedious, error-prone, and abandonment-prone.
- **No Smart Scheduling**: Most extensions use static intervals (1/3/7 days) instead of adaptive algorithms that adjust to *your* learning pace.

## The Solution

**LeetCode Tracker** bridges the gap with a **decoupled architecture** that's immune to LeetCode's layout changes:

1. **Native Overlay (Zero DOM Coupling)**: A floating card injects directly into `document.body`, asking for your confidence rating (Easy/Good/Hard/Again) *after* you solve a problem.
2. **Offline-First React Dashboard**: All data lives in browser localStorage. Review anytime, track progress, and export your stats—no internet required.
3. **Spaced Repetition Engine**: Built on the proven **SM-2 algorithm**, which calculates personalized review intervals based on your performance history.

The result? A seamless, resilient learning tool that survives LeetCode's CSS updates and doesn't steal your data.

---

## Core Features

### 🔄 Dynamic Spaced Repetition (SM-2 Algorithm)
Unlike static interval systems, LeetCode Tracker uses the **Supermemo-2 algorithm** to calculate review intervals:
- **Ease Factor** starts at 2.5 and adapts based on your ratings
- **Interval** grows intelligently: 1 day → 3 days → 10+ days based on performance
- **"Again" Click**: Resets the streak and lowers the ease factor to focus on weak concepts
- Your difficult problems naturally bubble back up for review sooner

### 🎯 Decoupled Overlay (Layout-Proof Design)
Instead of scraping LeetCode's DOM (which breaks constantly), we inject a custom overlay:
- Lives on `document.body` as a floating UI component
- Captures your 4-point confidence rating *your way*
- Sends data via cross-origin events to the dashboard
- **No fragile selectors. No CSS breakage. Zero maintenance.**

### ⏰ Time Machine Sandbox (Debug Tooling)
Professional-grade state testing built in:
- Fast-forward/rewind through your review schedule
- Simulate problem ratings and watch intervals recalculate
- Test weak areas and verify algorithm behavior
- Shows you *exactly* how the SM-2 math works

### 📚 Multi-Curriculum Tracking
Switch between popular roadmaps seamlessly:
- **Blind 75** - Essential tech interview prep
- **NeetCode 150** - Comprehensive DSA coverage
- **LeetCode 75** - LC's official path
- **Custom Lists** - Add your own problem sets
- Track progress independently for each curriculum

### 📊 Data Visualization
- **GitHub-Style Contribution Heatmap**: See your daily activity and identify learning streaks
- **Category Weakness Radar**: Visual chart showing which topics need more practice (Arrays, Trees, DP, etc.)
- **Performance Timeline**: Track how your ease factor and success rate evolve over time

---

## System Architecture

### 🏗️ Two-Part System Design

```
┌─────────────────────────┐
│   Firefox Extension     │  ← Monitors /submissions/ URLs
│  (Decoupled Overlay)    │     Captures confidence ratings
│                         │     Injects clean UI
└────────────┬────────────┘
             │ (Cross-origin event)
             ↓
┌─────────────────────────────────────────┐
│  React Dashboard + localStorage         │  ← Reviews problems
│  (Offline-First)                        │     Calculates intervals
│                                         │     Syncs with SM-2
└─────────────────────────────────────────┘
```

### 📡 Extension Pipeline

1. **URL Detection**: Background script monitors navigation to `leetcode.com/problems/[slug]/submissions/`
2. **URL Cleaning**: Extracts problem slug (e.g., `two-sum` from the full path)
3. **Overlay Injection**: Floating card appears asking: *"How was this problem? Easy / Good / Hard / Again"*
4. **Rating Capture**: User selects difficulty
5. **Event Payload**: Sends structured data: `{ slug, difficulty, timestamp }` via cross-origin event
6. **Dashboard Sync**: React app catches the event, updates localStorage, recalculates review interval

### ⚙️ React Dashboard

The dashboard is your command center:

```typescript
// handleExtensionPayload hook catches incoming events
const handleExtensionPayload = (event: Event) => {
  const { slug, difficulty, timestamp } = event.detail;
  
  // Calculate new interval using SM-2
  const newInterval = calculateInterval(difficulty, currentEaseFactor);
  
  // Update problem record
  const problem = problemStore[slug];
  problem.easeFactor = updateEaseFactor(difficulty, problem.easeFactor);
  problem.nextReview = timestamp + (newInterval * 86400000); // ms
  
  // Persist to localStorage
  localStorage.setItem('problems', JSON.stringify(problemStore));
};
```

Features:
- **Offline Mode**: All data synced to browser storage—no server needed
- **Review Queue**: See today's problems sorted by overdue status
- **Stats Dashboard**: Success rate, total problems, current streak
- **Curriculum Switching**: Flip between roadmaps instantly

---

## The Math Behind the Brain

The **SM-2 algorithm** is the engine driving personalized review intervals. Here's the transparency:

### SM-2 Parameters

| Parameter | Initial Value | Purpose |
|-----------|---------------|---------|
| **Ease Factor (EF)** | 2.5 | Multiplier for interval growth |
| **Interval (I)** | 1 day | Days until next review |
| **Repetition (n)** | 0 | Consecutive correct repetitions |

### How It Works

**When you rate a problem:**

- **Easy** (5): `EF` increases by 0.1 → longer review interval
  ```
  EF = max(1.3, EF + (0.1 - (5 - 4) * (0.08 - (5 - 4) * 0.02)))
     = max(1.3, 2.5 + 0.1) = 2.6
  I = I * EF  (interval grows)
  ```

- **Good** (4): `EF` stays stable → normal progression
  ```
  EF = 2.5 (unchanged)
  I = I * EF
  ```

- **Hard** (3): `EF` drops by 0.14 → shorter interval, more reviews
  ```
  EF = max(1.3, 2.5 - 0.14) = 2.36
  I = 1 day (resets)
  ```

- **Again** (1): Streak resets, focus needed
  ```
  EF = max(1.3, EF - 0.2)
  I = 1 day
  n = 0 (back to square one)
  ```

**Result**: Problems you struggle with come back sooner. Problems you master disappear for months.

---

## Installation & Setup Guide

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **Firefox** (latest version recommended)
- **Git**

### Part 1: Web Dashboard

The React dashboard runs locally on your machine.

```bash
# Clone the repository
git clone https://github.com/AnsgenixD/Leetcode-tracker.git
cd Leetcode-tracker/DSA-tracker\&Planner

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm build
```

Visit `http://localhost:3000` in your browser. You'll see an empty dashboard until the extension starts sending problem data.

### Part 2: Firefox Extension Setup

1. **Navigate to Extension Manager**:
   - Open Firefox
   - Go to `about:debugging` (paste in address bar)
   - Click **"This Firefox"** on the left

2. **Load the Extension**:
   - Click **"Load Temporary Add-on"**
   - Navigate to `Leetcode-tracker/extension/` folder
   - Select `manifest.json`
   - The extension is now active!

3. **Verify Installation**:
   - Go to **LeetCode.com**
   - Solve a problem
   - After submission, you should see a floating overlay asking for your confidence rating
   - Your rating appears in the dashboard within seconds

4. **(Optional) Persistent Installation**:
   - For development/testing, repeat steps 1-2 each session
   - To make it permanent, follow [Firefox's official extension guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

---

## Usage

### Daily Workflow

1. **Open the Dashboard** (`http://localhost:3000`)
   - See today's review queue sorted by overdue status
   - Track your current streak and overall progress

2. **Solve on LeetCode**
   - Code your solution as normal
   - After submission, the overlay appears
   - Rate the problem: **Easy** / **Good** / **Hard** / **Again**

3. **Watch Data Sync**
   - Your rating instantly updates the dashboard
   - New review interval is calculated
   - Progress heatmap updates

4. **Review Anytime**
   - Check the dashboard for weak areas (radar chart)
   - Revisit problems you've struggled with
   - Export your stats

### Roadmap Selection

In the dashboard, you can switch between:
- **Blind 75**
- **NeetCode 150**
- **LeetCode 75**
- **Custom** (add your own problem list)

Each roadmap tracks progress independently.

---

## Future Roadmap

### 🔜 Planned Features

- **GitHub Auto-Sync** (LeetHub Alternative)
  - Automatically commit your solutions to a GitHub repo
  - Link your LeetCode submissions to clean, organized code repositories
  - Never lose a solution again

- **Code Snippet Capture**
  - Background worker intercepts network requests on submission
  - Stores the full solution code locally
  - Review old solutions during spaced repetition sessions

- **Sync Across Devices**
  - Cloud backup with encrypted localStorage sync
  - Access your progress from any browser
  - Optional Anki export for portable study

- **AI-Powered Hints**
  - Smart difficulty predictions based on problem classification
  - Pattern detection: "You struggle with tree problems"
  - Personalized study recommendations

- **Collaborative Roadmaps**
  - Share custom curricula with friends
  - Group progress tracking
  - Community problem lists

---

## Project Structure

```
Leetcode-tracker/
├── DSA-tracker&Planner/          # React Dashboard
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── hooks/                # SM-2 algorithm & event handlers
│   │   ├── types/                # TypeScript interfaces
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── extension/                    # Firefox Extension
│   ├── background.js             # URL monitoring & data capture
│   ├── content.js                # Overlay injection
│   ├── manifest.json
│   └── icons/
│
└── README.md
```

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | Dashboard UI & state management |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Storage** | localStorage API | Offline-first, persistent data |
| **Extension** | Firefox WebExtensions | Cross-origin event communication |
| **Build** | Vite | Fast HMR development & bundling |
| **Algorithm** | SM-2 (Supermemo 2) | Adaptive spaced repetition |

---

## How It Stays Resilient

### Why Other Extensions Break

```html
<!-- LeetCode's old HTML (2024) -->
<button class="btn-submit">Submit</button>

<!-- LeetCode's new HTML (2025) - breaks DOM scrapers -->
<button class="btn--primary-lg">Submit Code</button>
```

DOM scrapers like LeetHub hardcode selectors. When LeetCode redesigns, these break overnight.

### How LeetCode Tracker Avoids This

We don't scrape the DOM. We ask the user directly via a clean, native overlay. Even if LeetCode rewrites their entire codebase, our overlay still works because it lives independently on `document.body`.

---

## Contributing

This project is in active development! We welcome:
- Bug reports and feature requests
- Pull requests for new roadmaps or algorithm improvements
- UI/UX feedback and design contributions

Please open an issue first to discuss major changes.

---

## License

MIT License – see [LICENSE](LICENSE) for details.

---

## Support

Having issues?

- **Extension not appearing?** → Check `about:debugging` to verify it's loaded
- **Data not syncing?** → Open browser console (`F12`), check for errors
- **Intervals seem wrong?** → Try the Time Machine Sandbox to debug the SM-2 calculation
- **Dashboard stuck?** → Clear localStorage: `localStorage.clear()`, reload

---

<div align="center">
  <p><strong>Made with ❤️ for serious LeetCode learners</strong></p>
  <p>Questions? Open an issue or reach out on GitHub</p>
</div>
