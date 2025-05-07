import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { GameSession, Player, Team, Vote, GameStatus } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private db: AngularFireDatabase,
    private auth: AngularFireAuth
  ) {}

  // Authentication
  async signInAnonymously(): Promise<string> {
    const result = await this.auth.signInAnonymously();
    return result.user?.uid || '';
  }

  // Game Session Management
  createGameSession(): Observable<string> {
    return from(this.signInAnonymously()).pipe(
      switchMap(uid => {
        const sessionRef = this.db.list('sessions').push({
          status: 'lobby',
          currentQuestionIndex: 0,
          players: {},
          votes: {},
          scores: {},
          countdown: 0
        });
        return of(sessionRef.key || '');
      })
    );
  }

  getGameSession(sessionId: string): Observable<GameSession | null> {
    return this.db.object<GameSession>(`sessions/${sessionId}`).valueChanges();
  }

  // Player Management
  joinGame(sessionId: string, player: Player): Observable<void> {
    return from(this.signInAnonymously()).pipe(
      switchMap(uid => {
        const playerRef = this.db.object(`sessions/${sessionId}/players/${uid}`);
        return from(playerRef.set({
          ...player,
          id: uid,
          score: 0
        }));
      })
    );
  }

  // Game State Management
  updateGameStatus(sessionId: string, status: string): Observable<void> {
    return from(this.db.object(`sessions/${sessionId}/status`).set(status));
  }

  setCurrentTheme(sessionId: string, theme: any): Observable<void> {
    return from(this.db.object(`sessions/${sessionId}/currentTheme`).set(theme));
  }

  // Voting
  submitVote(sessionId: string, questionIndex: number, vote: Vote): Observable<void> {
    return from(this.auth.currentUser).pipe(
      switchMap(user => {
        if (!user) return of(void 0);
        const voteRef = this.db.object(
          `sessions/${sessionId}/votes/${questionIndex}/${user.uid}`
        );
        return from(voteRef.set(vote));
      })
    );
  }

  // Score Management
  updateScore(sessionId: string, playerId: string, score: number): Observable<void> {
    return from(this.db.object(`sessions/${sessionId}/scores/${playerId}`).set(score));
  }

  // Countdown
  updateCountdown(sessionId: string, countdown: number): Observable<void> {
    return from(this.db.object(`sessions/${sessionId}/countdown`).set(countdown));
  }

  // Cleanup
  async leaveGame(sessionId: string): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      await this.db.object(`sessions/${sessionId}/players/${user.uid}`).remove();
    }
  }

  removePlayer(sessionId: string, playerId: string): Promise<void> {
    return this.db.object(`sessions/${sessionId}/players/${playerId}`).remove()
      .then(() => {
        // Also remove player's votes and scores
        return Promise.all([
          this.db.object(`sessions/${sessionId}/votes/${playerId}`).remove(),
          this.db.object(`sessions/${sessionId}/scores/${playerId}`).remove()
        ]);
      })
      .then(() => {
        // Check if this was the last player and clean up the session if needed
        return this.db.object(`sessions/${sessionId}/players`).valueChanges().pipe(
          take(1),
          map(players => {
            if (!players || Object.keys(players).length === 0) {
              return this.db.object(`sessions/${sessionId}`).remove();
            }
            return Promise.resolve();
          })
        ).toPromise();
      })
      .then(() => Promise.resolve());
  }
} 