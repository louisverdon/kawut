import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { GameSession, GameStatus, Player } from '../../models/game.models';

@Component({
  selector: 'app-game',
  template: `
    <div class="game-container">
      <!-- Waiting Screen -->
      <div *ngIf="gameStatus === GameStatus.LOBBY" class="waiting-screen">
        <h2>Waiting for players...</h2>
        <app-qr-code [sessionId]="sessionId"></app-qr-code>
        <div class="player-list">
          <h3>Players:</h3>
          <ul>
            <li *ngFor="let player of players">
              {{ player.name }} ({{ player.team }})
            </li>
          </ul>
        </div>
      </div>

      <!-- Countdown Screen -->
      <div *ngIf="gameStatus === GameStatus.COUNTDOWN" class="countdown-screen">
        <h2>Game starts in</h2>
        <div class="countdown">{{ countdown }}</div>
      </div>

      <!-- Question Screen -->
      <div *ngIf="gameStatus === GameStatus.QUESTION" class="question-screen">
        <app-question
          [question]="currentQuestion"
          (answerSelected)="submitAnswer($event)">
        </app-question>
      </div>

      <!-- Scoreboard Screen -->
      <div *ngIf="gameStatus === GameStatus.SCOREBOARD" class="scoreboard-screen">
        <app-scoreboard
          [players]="players"
          [totalQuestions]="totalQuestions">
        </app-scoreboard>
      </div>

      <!-- Game Over Screen -->
      <div *ngIf="gameStatus === GameStatus.FINISHED" class="game-over-screen">
        <h2>Game Over!</h2>
        <app-scoreboard
          [players]="players"
          [totalQuestions]="totalQuestions">
        </app-scoreboard>
        <button (click)="goToHome()">Return to Home</button>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .waiting-screen,
    .countdown-screen,
    .question-screen,
    .scoreboard-screen,
    .game-over-screen {
      text-align: center;
    }

    .player-list {
      margin-top: 2rem;
    }

    .countdown {
      font-size: 4rem;
      font-weight: bold;
      margin: 2rem 0;
    }

    button {
      margin-top: 2rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  sessionId: string = '';
  gameStatus: GameStatus = GameStatus.LOBBY;
  countdown: number = 3;
  players: Player[] = [];
  currentQuestion: any = null;
  totalQuestions: number = 0;
  GameStatus = GameStatus;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.params['sessionId'];
    this.setupGameSession();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupGameSession() {
    this.subscriptions.push(
      this.gameService.getCurrentSession().subscribe(session => {
        if (session) {
          this.gameStatus = session.status;
          this.countdown = session.countdown;
          this.players = Object.values(session.players);
          this.currentQuestion = session.currentTheme?.questions[session.currentQuestionIndex];
          this.totalQuestions = session.currentTheme?.questions.length || 0;
        }
      })
    );
  }

  submitAnswer(answer: string | number) {
    this.gameService.submitAnswer(this.sessionId, this.currentQuestion.id, answer);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
} 