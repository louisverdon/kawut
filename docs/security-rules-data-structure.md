# Security Rules and Data Structure

## Overview
This document outlines the security rules and data structure requirements for the Kawut application's Firebase implementation.

## Data Structure

### 1. Sessions Collection
```sessions/
  ├── {sessionId}/
  │   ├── status: string
  │   ├── currentQuestionIndex: number
  │   ├── players/
  │   │   └── {playerId}/
  │   │       ├── id: string
  │   │       ├── name: string
  │   │       ├── team: string
  │   │       ├── score: number
  │   │       └── isHost: boolean
  │   ├── votes/
  │   │   └── {questionIndex}/
  │   │       └── {playerId}/
  │   │           ├── playerId: string
  │   │           ├── answer: string | number
  │   │           └── timestamp: number
  │   ├── scores/
  │   │   └── {playerId}: number
  │   ├── countdown: number
  │   └── currentTheme/
  │       ├── id: string
  │       ├── name: string
  │       └── questions/
  │           └── {questionId}/
  │               ├── id: string
  │               ├── text: string
  │               ├── options: string[]
  │               ├── isNumeric: boolean
  │               └── correctAnswer: string | number
```

## Security Rules

### 1. Authentication Rules
```javascript
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 2. Session Rules
```javascript
{
  "rules": {
    "sessions": {
      "$sessionId": {
        // Allow read if user is authenticated
        ".read": "auth != null",
        
        // Allow write if user is authenticated and either:
        // 1. Creating a new session
        // 2. Is a player in the session
        // 3. Is the host of the session
        ".write": "auth != null && (
          !data.exists() || 
          data.child('players').child(auth.uid).exists() ||
          data.child('players').child(auth.uid).child('isHost').val() === true
        )",
        
        "players": {
          "$playerId": {
            // Allow read for all authenticated users
            ".read": "auth != null",
            
            // Allow write if:
            // 1. User is the player being modified
            // 2. User is the host
            ".write": "auth != null && (
              $playerId === auth.uid ||
              root.child('sessions').child($sessionId).child('players').child(auth.uid).child('isHost').val() === true
            )"
          }
        },
        
        "votes": {
          "$questionIndex": {
            "$playerId": {
              // Allow read for all authenticated users
              ".read": "auth != null",
              
              // Allow write if:
              // 1. User is the player submitting the vote
              // 2. User is the host
              ".write": "auth != null && (
                $playerId === auth.uid ||
                root.child('sessions').child($sessionId).child('players').child(auth.uid).child('isHost').val() === true
              )"
            }
          }
        },
        
        "scores": {
          "$playerId": {
            // Allow read for all authenticated users
            ".read": "auth != null",
            
            // Allow write if:
            // 1. User is the host
            // 2. User is the player being scored
            ".write": "auth != null && (
              root.child('sessions').child($sessionId).child('players').child(auth.uid).child('isHost').val() === true ||
              $playerId === auth.uid
            )"
          }
        }
      }
    }
  }
}
```

## Data Validation Rules

### 1. Session Validation
- Status must be one of: 'lobby', 'countdown', 'question', 'voting', 'scoreboard', 'finished'
- CurrentQuestionIndex must be a non-negative number
- Countdown must be between 0 and 3

### 2. Player Validation
- Name must be a non-empty string
- Team must be either 'yellow' or 'red'
- Score must be a non-negative number
- isHost must be a boolean

### 3. Vote Validation
- Answer must be either a string or number
- Timestamp must be a valid Unix timestamp
- PlayerId must match an existing player

### 4. Theme Validation
- Name must be a non-empty string
- Questions array must not be empty
- Each question must have required fields

## Security Considerations

### 1. Authentication
- Anonymous authentication for player identification
- Host privileges for game control
- Session-specific access control

### 2. Data Protection
- Prevent unauthorized session modifications
- Protect host-only operations
- Validate data structure and types
- Prevent score manipulation

### 3. Rate Limiting
- Implement request rate limiting
- Prevent spam voting
- Limit session creation

## Next Steps
1. Implement the security rules in Firebase
2. Add data validation in the application
3. Implement rate limiting
4. Add session cleanup rules
5. Create backup and recovery procedures 