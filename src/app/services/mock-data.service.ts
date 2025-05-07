import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { GameSession, Player, Team, Vote, GameStatus, Theme, Question } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Mock data storage
  private sessions: Map<string, GameSession> = new Map();
  private currentSession = new BehaviorSubject<GameSession | null>(null);
  
  // Mock themes and questions
  private mockThemes: Theme[] = [
    {
      id: 'theme1',
      name: 'General Knowledge',
      questions: [
        {
          id: 'q1',
          text: 'What year was the first iPhone released?',
          isNumeric: true,
          correctAnswer: 2007
        },
        {
          id: 'q2',
          text: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          isNumeric: false,
          correctAnswer: 'Paris'
        },
        {
          id: 'q3',
          text: 'How many planets are in our solar system?',
          isNumeric: true,
          correctAnswer: 8
        }
      ]
    },
    {
      id: 'theme2',
      name: 'Entertainment',
      questions: [
        {
          id: 'q1',
          text: 'Who played Iron Man in the Marvel movies?',
          options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
          isNumeric: false,
          correctAnswer: 'Robert Downey Jr.'
        },
        {
          id: 'q2',
          text: 'In what year was the first Star Wars movie released?',
          isNumeric: true,
          correctAnswer: 1977
        },
        {
          id: 'q3',
          text: 'Which band performed the song "Bohemian Rhapsody"?',
          options: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'],
          isNumeric: false,
          correctAnswer: 'Queen'
        }
      ]
    }
  ];

  constructor() {
    // Initialize with a demo session
    this.createDemoSession();
  }

  private createDemoSession(): void {
    const sessionId = 'demo-session';
    const session: GameSession = {
      id: sessionId,
      status: GameStatus.LOBBY,
      currentQuestionIndex: 0,
      players: {},
      votes: {},
      scores: {},
      countdown: 0,
      currentTheme: this.mockThemes[0]
    };
    this.sessions.set(sessionId, session);
  }

  // Authentication simulation
  signInAnonymously(): Promise<string> {
    // Generate a random user ID
    const userId = 'user_' + Math.random().toString(36).substring(2, 9);
    return Promise.resolve(userId);
  }

  // Game Session Management
  createGameSession(): Observable<string> {
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 9);
    const newSession: GameSession = {
      id: sessionId,
      status: GameStatus.LOBBY,
      currentQuestionIndex: 0,
      players: {},
      votes: {},
      scores: {},
      countdown: 0
    };
    this.sessions.set(sessionId, newSession);
    return of(sessionId).pipe(delay(500)); // Simulate network delay
  }

  getGameSession(sessionId: string): Observable<GameSession | null> {
    const session = this.sessions.get(sessionId) || null;
    if (session) {
      this.currentSession.next(session);
    }
    return of(session).pipe(delay(300)); // Simulate network delay
  }

  // Player Management
  joinGame(sessionId: string, player: Player): Observable<void> {
    return of(player).pipe(
      delay(500), // Simulate network delay
      map(p => {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.players[p.id] = p;
          this.currentSession.next(session);
        }
        return undefined;
      })
    );
  }

  // Game State Management
  updateGameStatus(sessionId: string, status: string): Observable<void> {
    return of(void 0).pipe(
      delay(300), // Simulate network delay
      tap(() => {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.status = status as GameStatus;
          this.currentSession.next(session);
        }
      })
    );
  }

  setCurrentTheme(sessionId: string, theme: Theme): Observable<void> {
    return of(void 0).pipe(
      delay(300), // Simulate network delay
      tap(() => {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.currentTheme = theme;
          this.currentSession.next(session);
        }
      })
    );
  }

  // Voting
  submitVote(sessionId: string, questionIndex: number, vote: Vote): Observable<void> {
    return of(void 0).pipe(
      delay(300), // Simulate network delay
      tap(() => {
        const session = this.sessions.get(sessionId);
        if (session) {
          // Initialize the votes structure if it doesn't exist
          if (!session.votes[questionIndex]) {
            // Create an empty object that will hold player votes
            session.votes[questionIndex] = {};
          }
          
          // Add the vote to the appropriate index and player
          session.votes[questionIndex][vote.playerId] = vote;
          
          this.currentSession.next(session);
        }
      })
    );
  }

  // Score Management
  updateScore(sessionId: string, playerId: string, score: number): Observable<void> {
    return of(void 0).pipe(
      delay(300), // Simulate network delay
      tap(() => {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.scores[playerId] = score;
          if (session.players[playerId]) {
            session.players[playerId].score = score;
          }
          this.currentSession.next(session);
        }
      })
    );
  }

  // Countdown
  updateCountdown(sessionId: string, countdown: number): Observable<void> {
    return of(void 0).pipe(
      delay(100), // Faster for countdown updates
      tap(() => {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.countdown = countdown;
          this.currentSession.next(session);
        }
      })
    );
  }

  // Cleanup
  leaveGame(sessionId: string): Promise<void> {
    return Promise.resolve();
  }

  removePlayer(sessionId: string, playerId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session && session.players[playerId]) {
      delete session.players[playerId];
      this.currentSession.next(session);
    }
    return Promise.resolve();
  }

  // Helper methods for mock data
  getAvailableThemes(): Theme[] {
    return this.mockThemes;
  }
} 