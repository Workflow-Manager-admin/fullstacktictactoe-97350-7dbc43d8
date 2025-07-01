# Tic Tac Toe – Modern React Frontend

A modern, minimalistic, and responsive React app for playing Tic Tac Toe with authentication, real-time play, and history/statistics!  
Light-themed with primary color `#2196f3`, accent `#e91e63`, and clean UI.

## Features

- User registration, login, session persistence
- Create new games vs other users
- Real-time board updates (auto-refresh)
- See player info and whose turn it is
- Game history and personal statistics view
- Responsive UI for desktop and mobile

## Project Structure

```
src/
  App.js                # Main app routing, context, and layout
  App.css               # Modern/minimal CSS (primary palette)
  index.js              # App entry point
  auth/
    AuthContext.js      # Auth provider and hooks
    LoginPage.js        # Login UI
    RegisterPage.js     # Registration UI
  game/
    GameBoardPage.js    # Main board + game status/actions
    GameBoardPage.css   # Board, player layout, etc
    GameHistoryPage.js  # List of previous games/statistics
    NewGamePage.js      # Start a new game flow
```

## Setup & Usage

1. `npm install`
2. `npm start`

To connect to your backend at a custom URL, set the variable:
```bash
REACT_APP_TTT_API=http://localhost:3001 npm start
```

## Routing

- `/login` — Login
- `/register` — Register
- `/games/new` — Start new game
- `/games/:gameId` — Play/view a game
- `/games/history` — Game history/statistics

## API Integration

All backend API endpoints should be compatible with the FastAPI backend:
- Registration: `POST /auth/register`
- Login:       `POST /auth/login`
- Game actions: See `/games` endpoints

## Design

- Centered board with player info above, actions below
- Modern rounded containers; no UI framework needed
- Color palette:  
  - Primary: #2196f3
  - Accent: #e91e63
  - Secondary BG: #f5f5f5
- Responsive for desktop & mobile

