# Firebase Configuration Documentation

## Overview
The Kawut application uses Firebase for real-time data synchronization, authentication, and game state management. This document outlines the current Firebase configuration and implementation details.

## Configuration
The Firebase configuration is stored in `src/environments/environment.ts`. The current configuration requires the following values to be set:

```typescript
firebase: {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Firebase Service Implementation

### Authentication
- Uses anonymous authentication for player identification
- `signInAnonymously()` method handles player authentication
- Each player receives a unique UID for session management

### Database Structure
The Firebase Realtime Database uses the following structure:

```
sessions/
  ├── {sessionId}/
  │   ├── status: string
  │   ├── currentQuestionIndex: number
  │   ├── players/
  │   │   └── {playerId}/
  │   │       ├── id: string
  │   │       ├── name: string
  │   │       └── score: number
  │   ├── votes/
  │   │   └── {questionIndex}/
  │   │       └── {playerId}: Vote
  │   ├── scores/
  │   │   └── {playerId}: number
  │   └── countdown: number
```

### Key Features

#### Game Session Management
- `createGameSession()`: Creates a new game session with initial state
- `getGameSession()`: Retrieves real-time updates for a specific session
- `updateGameStatus()`: Updates the game status (lobby, playing, finished)

#### Player Management
- `joinGame()`: Adds a player to a game session
- `leaveGame()`: Removes a player from a session
- `removePlayer()`: Handles player removal and session cleanup

#### Game State
- `setCurrentTheme()`: Updates the current game theme
- `updateCountdown()`: Manages game countdown timer
- `updateScore()`: Updates player scores in real-time

#### Voting System
- `submitVote()`: Records player votes for questions
- Votes are stored per question and player

## Security Considerations
1. Anonymous authentication is used for player identification
2. Database rules should be implemented to:
   - Allow read access to active sessions
   - Restrict write access to authenticated users
   - Validate data structure and types
   - Prevent unauthorized session modifications

## Dependencies
- @angular/fire/compat/database
- @angular/fire/compat/auth

## Next Steps
1. Implement Firebase security rules
2. Add error handling for offline scenarios
3. Implement data validation
4. Add session cleanup for abandoned games 