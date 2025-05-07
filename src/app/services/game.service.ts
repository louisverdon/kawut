import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, timer, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { GameSession, Player, Question, Team, Vote, GameStatus } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentSession: GameSession | null = null;
  private currentPlayer: Player | null = null;

  constructor(@Inject('DataService') private dataService: any) {}

  // Session Management
  createGame(): Observable<string> {
    return this.dataService.createGameSession();
  }

  joinSession(sessionId: string, name: string, team: Team, isHost: boolean = false): Observable<void> {
    const player: Player = {
      id: '',
      name,
      team,
      score: 0,
      isHost
    };

    return this.dataService.joinGame(sessionId, player).pipe(
      map(() => {
        this.setupSessionListener(sessionId);
        this.currentPlayer = player;
      })
    );
  }

  private setupSessionListener(sessionId: string): void {
    this.dataService.getGameSession(sessionId).subscribe((session: GameSession | null) => {
      this.currentSession = session;
    });
  }

  // Game State
  getCurrentSession(): Observable<GameSession | null> {
    return of(this.currentSession);
  }

  getCurrentPlayer(): Observable<Player | null> {
    return of(this.currentPlayer);
  }

  // Game Flow
  startGame(sessionId: string, theme: any): Observable<void> {
    return this.dataService.setCurrentTheme(sessionId, theme).pipe(
      switchMap(() => this.dataService.updateGameStatus(sessionId, GameStatus.COUNTDOWN))
    );
  }

  startCountdown(sessionId: string): Observable<void> {
    return timer(0, 1000).pipe(
      take(4),
      map(count => 3 - count),
      switchMap(count => {
        if (count === 0) {
          return this.dataService.updateGameStatus(sessionId, GameStatus.QUESTION);
        }
        return this.dataService.updateCountdown(sessionId, count);
      })
    ) as Observable<void>;
  }

  startVoting(sessionId: string): Observable<void> {
    return this.dataService.updateGameStatus(sessionId, GameStatus.VOTING);
  }

  submitAnswer(sessionId: string, questionIndex: number, answer: string | number): Observable<void> {
    const vote: Vote = {
      playerId: this.currentPlayer?.id || '',
      answer,
      timestamp: Date.now()
    };
    return this.dataService.submitVote(sessionId, questionIndex, vote);
  }

  setHostAnswer(sessionId: string, questionIndex: number, answer: string | number): Observable<void> {
    const currentSession = this.currentSession;
    if (!currentSession?.currentTheme) return of(undefined) as Observable<void>;

    const question = currentSession.currentTheme.questions[questionIndex];
    question.correctAnswer = answer;

    return this.dataService.updateGameStatus(sessionId, GameStatus.SCOREBOARD).pipe(
      map(() => {
        // Calculate scores
        const votes = currentSession.votes[questionIndex] || {};
        Object.entries(votes).forEach(([playerId, vote]) => {
          const player = currentSession.players[playerId];
          if (!player) return;

          let points = 0;
          if (question.isNumeric) {
            const diff = Math.abs(Number(vote.answer) - Number(answer));
            points = Math.max(0, 1000 - diff * 10);
          } else if (vote.answer === answer) {
            const timeDiff = vote.timestamp - currentSession.countdown;
            points = Math.max(100, 1000 - timeDiff / 100);
          }

          const newScore = (player.score || 0) + points;
          this.dataService.updateScore(sessionId, playerId, newScore);
        });
      })
    );
  }

  nextQuestion(sessionId: string): Observable<void> {
    const currentSession = this.currentSession;
    if (!currentSession?.currentTheme) return of(undefined) as Observable<void>;

    const nextIndex = currentSession.currentQuestionIndex + 1;
    if (nextIndex >= currentSession.currentTheme.questions.length) {
      return this.dataService.updateGameStatus(sessionId, GameStatus.FINISHED);
    }

    return this.dataService.updateGameStatus(sessionId, GameStatus.COUNTDOWN).pipe(
      map(() => {
        this.dataService.updateCountdown(sessionId, 3);
      })
    );
  }

  updateGameStatus(sessionId: string, status: GameStatus): Observable<void> {
    return this.dataService.updateGameStatus(sessionId, status);
  }

  // Cleanup
  leaveGame(sessionId: string): Promise<void> {
    if (!this.currentPlayer) {
      return Promise.resolve();
    }
    return this.dataService.removePlayer(sessionId, this.currentPlayer.id);
  }
} 