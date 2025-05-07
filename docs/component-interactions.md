# Component Interactions

## Overview
The Kawut application is built using Angular components that work together to create a seamless multiplayer quiz experience. This document outlines the component structure and their interactions.

## Component Hierarchy

```
App
├── Home
│   └── QRCode
├── Lobby
│   └── QRCode
├── Game
│   ├── Question
│   └── Scoreboard
└── Shared Components
```

## Component Descriptions

### 1. Home Component
- Entry point of the application
- Handles game session creation
- Provides session joining options
- **Interactions**:
  - Uses GameService for session creation
  - Integrates QRCode component for easy joining
  - Routes to Lobby on successful session creation

### 2. Lobby Component
- Pre-game waiting room
- Displays connected players
- Shows team assignments
- **Interactions**:
  - Uses GameService for player management
  - Integrates QRCode for additional player joining
  - Routes to Game component when game starts
  - Updates player list in real-time

### 3. Game Component
- Main gameplay container
- Manages game state transitions
- **Interactions**:
  - Coordinates between Question and Scoreboard
  - Uses GameService for game flow control
  - Handles game state changes
  - Manages component switching based on game phase

### 4. Question Component
- Displays current question
- Handles answer submission
- **Interactions**:
  - Uses GameService for answer submission
  - Updates based on game state
  - Communicates with parent Game component

### 5. Scoreboard Component
- Shows current scores
- Displays correct answers
- **Interactions**:
  - Uses GameService for score updates
  - Updates in real-time with Firebase
  - Displays team and individual scores

### 6. QRCode Component
- Generates and displays QR codes
- **Interactions**:
  - Used by both Home and Lobby components
  - Contains session joining information
  - Updates based on current session state

## Data Flow

### 1. Session Creation Flow
```
Home Component
    ↓
Create Session (GameService)
    ↓
Initialize Firebase Session
    ↓
Generate QR Code
    ↓
Route to Lobby
```

### 2. Player Joining Flow
```
QRCode/Lobby Component
    ↓
Join Session (GameService)
    ↓
Update Firebase Session
    ↓
Update Lobby Display
```

### 3. Game Flow
```
Game Component
    ↓
Question Component
    ↓
Answer Submission
    ↓
Scoreboard Component
    ↓
Next Question/Game End
```

## State Management
- Components subscribe to GameService observables
- Real-time updates through Firebase
- State changes trigger component updates
- Parent-child communication through services

## Error Handling
- Components handle their own error states
- Service-level error handling
- User feedback for failed operations
- Recovery mechanisms for disconnections

## Next Steps
1. Implement component-level error boundaries
2. Add loading states for async operations
3. Enhance component communication patterns
4. Implement component-level testing 