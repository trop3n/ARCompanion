# Arc Raiders Companion

A desktop companion application for Arc Raiders built with Electron and React. Track event timers, explore the item database, view expedition projects, and workbench upgrade requirements.

## Features

### Event Timers
- **Live Event Tracking**: Displays currently active map events with countdown timers
- **Upcoming Events**: Shows the next 6 upcoming events with start times
- **Fixed Schedule**: Events rotate hourly based on UTC time
- **Real-time Updates**: Countdowns update every second for accuracy

### Item Database
- **Comprehensive Item List**: Browse all Arc Raiders items
- **Search Functionality**: Quickly find items by name or description
- **Advanced Filtering**: Filter by category and rarity
- **Detailed Information**:
  - Sell values
  - Recycling outputs
  - Crafting recipes that use each item
  - Item categories and rarities

### Expedition Projects
- **Project Requirements**: View material requirements for expedition projects
- **Objectives**: See all objectives for each project
- **Rewards**: Check what rewards you'll receive

### Workbench Upgrades
- **Upgrade Levels**: View all workbench upgrade tiers
- **Requirements**: See materials needed for each upgrade
- **Benefits**: Understand what each upgrade unlocks
- **Cost Information**: Check credit costs for upgrades

## Tech Stack

- **Electron** v39 - Desktop application framework
- **React** v19 - UI library
- **React Router** v7 - Client-side routing
- **Axios** - HTTP client for API requests
- **date-fns** - Date manipulation and formatting
- **electron-store** - Persistent local data caching

## Data Sources

The app integrates with community APIs to fetch Arc Raiders game data:
- **Primary**: MetaForge API
- **Fallback**: ARDB API

Data is cached locally for 12 hours to reduce API calls and enable offline functionality.

## Installation

### Prerequisites
- Node.js v22.14.0 or higher
- npm or yarn

### Setup

1. Clone or navigate to the project directory:
```bash
cd arc-raiders-companion
```

2. Install dependencies:
```bash
npm install
```

## Development

### Run in Development Mode
```bash
npm run electron:dev
```

This will:
- Start the React development server on port 3000
- Launch the Electron window
- Enable hot-reload for React changes
- Open DevTools automatically

### Project Structure
```
arc-raiders-companion/
├── electron/              # Electron main process
│   ├── main.js           # Application entry point
│   ├── preload.js        # IPC security bridge
│   └── ipc/              # IPC handlers
│       └── apiHandlers.js
├── src/                  # React application
│   ├── App.js
│   ├── components/       # UI components
│   ├── contexts/         # React contexts (state)
│   ├── hooks/            # Custom React hooks
│   └── services/         # Business logic
├── public/               # Static assets
└── package.json
```

## Building for Production

### Build for Current Platform
```bash
npm run electron:build
```

### Build for Specific Platform
```bash
npm run electron:build:win    # Windows (NSIS installer)
npm run electron:build:mac    # macOS (DMG)
npm run electron:build:linux  # Linux (AppImage, .deb)
```

Built applications will be in the `dist/` directory.

## Architecture

### Electron Security
- **Context Isolation**: Enabled to prevent renderer access to Node.js
- **Node Integration**: Disabled in renderer process
- **IPC Communication**: All Node.js operations via secure IPC handlers
- **Preload Script**: Exposes minimal, safe API surface to React

### Data Flow
1. **API Fetching**: Main process fetches data from community APIs
2. **Caching**: Data stored in electron-store with timestamps
3. **State Management**: React Context API for global state
4. **Local Calculation**: Event timers calculated locally (no API dependency)

### Event Timer System
Events rotate on a fixed hourly schedule (UTC-based). The app calculates:
- Current active event
- Upcoming events for next 24 hours
- Countdown timers updated every second

No API calls needed for timer updates after initial schedule load.

## Configuration

### API Endpoints
Primary API: `https://metaforge.app/api/arc-raiders`
Fallback API: `https://ardb.app/api`

### Cache Duration
Data cached for 12 hours by default. Configurable in `electron/ipc/apiHandlers.js`.

## Troubleshooting

### React Build Errors
If you see module parse errors, ensure `package.json` doesn't have `"type": "commonjs"`.

### API Errors
The app will fall back to cached data if APIs are unavailable. Check the error message in the UI for details.

### WSL/Linux Library Issues
On WSL, you may see Electron library errors (`libnspr4.so`). This doesn't affect the code - the app will work fine on native Windows/Mac/Linux desktops.

## Development Notes

### Adding New Features
1. API data fetching: Add handlers in `electron/ipc/apiHandlers.js`
2. State management: Update `src/contexts/DataContext.js`
3. Components: Create in `src/components/`
4. Routing: Add routes in `src/App.js`

### Styling
- Dark theme by default (Arc Raiders gaming aesthetic)
- Color palette: Blues, cyans, purples, dark grays
- Component-level CSS modules

## Future Enhancements

Potential features for future versions:
- Desktop notifications for upcoming events
- User inventory tracking
- Build planner for crafting
- Map viewer integration
- Auto-update functionality
- Multiple language support
- Custom themes
- Export/import data

## License

ISC

## Contributing

This is a personal project, but suggestions and improvements are welcome!
