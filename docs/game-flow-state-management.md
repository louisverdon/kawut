# Game Flow and State Management

## Overview
The Kawut application implements a real-time multiplayer quiz game with a structured game flow and state management system. This document outlines the game flow, state transitions, and data management.

## Game States
The game progresses through the following states (defined in `GameStatus` enum):

1. `LOBBY`: Initial state where players join the game
2. `COUNTDOWN`: 3-second countdown before each question
3. `QUESTION`: Question display and answer submission
4. `VOTING`: Players vote on answers
5. `SCOREBOARD`: Display of scores and correct answers
6. `FINISHED`: Game completion state

## Game Flow

### 1. Session Creation and Joining
- Host creates a new game session
- Players join using session ID or QR code
- Players are assigned to teams (YELLOW or RED)
- Host has special privileges for game control

### 2. Game Initialization
- Host selects a theme
- Game starts with countdown
- First question is displayed

### 3. Question Flow
For each question:
1. Countdown (3 seconds)
2. Question display
3. Answer submission
4. Voting phase
5. Score calculation
6. Scoreboard display
7. Next question or game end

### 4. Scoring System
- Numeric questions: Points based on answer proximity
  - Maximum 1000 points
  - Deductions based on difference from correct answer
- Multiple choice: Points based on speed and correctness
  - Maximum 1000 points
  - Minimum 100 points
  - Time-based deductions

## State Management

### GameService
The `GameService` manages game state and flow through:

1. **Session Management**
   - `createGame()`: Creates new game session
   - `joinSession()`: Handles player joining
   - `setupSessionListener()`: Real-time session updates

2. **Game Flow Control**
   - `startGame()`: Initiates game with selected theme
   - `startCountdown()`: Manages question countdown
   - `startVoting()`: Transitions to voting phase
   - `nextQuestion()`: Advances to next question

3. **Answer Processing**
   - `submitAnswer()`: Records player answers
   - `setHostAnswer()`: Processes correct answer and calculates scores

4. **State Updates**
   - `updateGameStatus()`: Manages state transitions
   - `getCurrentSession()`: Provides current game state
   - `getCurrentPlayer()`: Provides current player info

### Data Models

1. **GameSession**
   - Tracks overall game state
   - Manages players, votes, and scores
   - Contains current theme and question index

2. **Player**
   - Stores player information
   - Tracks team assignment and score
   - Identifies host status

3. **Question**
   - Defines question structure
   - Supports both numeric and multiple-choice formats
   - Stores correct answer

4. **Vote**
   - Records player answers
   - Includes timestamp for scoring
   - Links to player and question

## Real-time Synchronization
- Firebase Realtime Database handles state synchronization
- All state changes are immediately reflected across clients
- Automatic reconnection handling for network issues

## Error Handling
- Network disconnection recovery
- Invalid state transition prevention
- Missing player/answer handling

## Next Steps
1. Implement offline support
2. Add game pause/resume functionality
3. Enhance error recovery mechanisms
4. Add game state persistence 