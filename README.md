# Mobile Observation App

A modern, mobile-first observation and task management application integrated with Google Apps Script.

## Features

- **Dashboard**: Quick stats (Total, Unsafe, Safe) and recent activity feed.
- **Tasks**: Manage assigned tasks with a simple "Take Action" workflow.
- **Activity**: Review observations you created, with options to Reopen or Close (Rating).
- **Action Story**: Visual timeline of all actions taken on an observation.
- **AI Insights**: Integrated Gemini AI for safety trend analysis.

## Structure

```
src/
├── components/         # Reusable UI components
│   ├── ActionStory.js  # Timeline visualization
│   ├── AuthPage.js     # Login/Signup screen
│   ├── BottomNav.js    # Mobile navigation bar
│   ├── CreateModal.js  # Observation creation form
│   ├── ObservationCard.js # Main card component
│   └── ReviewModal.js  # Review/Close task modal
├── views/              # Main page views
│   ├── Activity.js     # User's created observations
│   ├── Dashboard.js    # Main dashboard
│   └── Tasks.js        # Assigned tasks
├── App.js              # Main application logic & state
├── index.css           # Global styles & Tailwind directives
└── index.js            # Entry point
```

## Setup

1.  **Install Dependencies**: `npm install`
2.  **Start Dev Server**: `npm start`
3.  **Build**: `npm run build`

## Configuration

- **Backend**: Configured in `src/App.js` (`WEB_APP_URL`).
- **AI**: Configured in `src/App.js` (`API_KEY`, `GEMINI_MODEL`).