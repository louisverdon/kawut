import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, timer, of } from 'rxjs';
import { map, take, switchMap, tap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { GameSession, Player, Question, Team, Vote, GameStatus } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentSession: GameSession | null = null;
  private currentPlayer: Player | null = null;
  
  // Create BehaviorSubject observables to emit updates
  private sessionSubject = new BehaviorSubject<GameSession | null>(null);
  private playerSubject = new BehaviorSubject<Player | null>(null);

  constructor(@Inject('DataService') private dataService: any) {}

  // Session Management
  createGame(): Observable<string> {
    return this.dataService.createGameSession().pipe(
      tap(sessionId => {
        // Mettre en place l'écouteur de session dès la création
        if (sessionId && typeof sessionId === 'string') {
          console.log('Game created with ID:', sessionId);
          this.setupSessionListener(sessionId);
        }
      })
    );
  }

  joinSession(sessionId: string, name: string, team: Team, isHost: boolean = false): Observable<void> {
    console.log('Joining session:', sessionId, 'as', name, 'team:', team, 'isHost:', isHost);
    
    // Créer un joueur avec un ID temporaire
    const player: Player = {
      id: '', // L'ID sera défini par Firebase
      name,
      team,
      score: 0,
      isHost
    };

    return this.dataService.joinGame(sessionId, player).pipe(
      tap(uid => {
        // Le service retourne maintenant l'UID du joueur
        if (uid && typeof uid === 'string') {
          // Mettre à jour l'ID du joueur avec celui de Firebase
          player.id = uid;
          console.log('Player ID set to:', uid);
        } else {
          console.error('No valid UID returned from joinGame');
        }
      }),
      switchMap(() => {
        // Mettre en place l'écouteur de session
        console.log('Setting up session listener for', sessionId);
        this.setupSessionListener(sessionId);
        
        // Mettre à jour l'état local
        this.currentPlayer = player;
        console.log('Current player updated:', this.currentPlayer);
        this.playerSubject.next(player);
        
        // Pas besoin de retourner quelque chose de spécial
        return of(undefined);
      })
    );
  }

  private setupSessionListener(sessionId: string): void {
    console.log('Starting session listener for session:', sessionId);
    this.dataService.getGameSession(sessionId).subscribe((session: GameSession | null) => {
      console.log('Session updated in GameService:', session);
      
      if (session) {
        console.log('Players in session:', Object.keys(session.players).length);
        
        // Si le joueur courant existe, vérifie s'il est dans la session
        if (this.currentPlayer) {
          const playerInSession = session.players[this.currentPlayer.id];
          console.log('Current player in session:', playerInSession ? 'yes' : 'no');
          
          // Si le joueur n'est pas dans la session mais a un ID, l'ajouter manuellement
          if (!playerInSession && this.currentPlayer.id) {
            console.log('Adding missing player to session:', this.currentPlayer);
            session.players[this.currentPlayer.id] = this.currentPlayer;
          }
        }
      }
      
      this.currentSession = session;
      this.sessionSubject.next(session); // Emit session update
    });
  }

  // Game State
  getCurrentSession(): Observable<GameSession | null> {
    return this.sessionSubject.asObservable();
  }

  getCurrentPlayer(): Observable<Player | null> {
    return this.playerSubject.asObservable();
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