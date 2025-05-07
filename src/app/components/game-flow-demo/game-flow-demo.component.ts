import { Component, OnInit, Inject } from '@angular/core';
import { GameSession, GameStatus, Theme } from '../../models/game.models';

@Component({
  selector: 'app-game-flow-demo',
  template: `
    <div class="flow-demo-container">
      <h1>Game Flow Demonstration</h1>
      
      <div class="state-controls">
        <h2>Current Game State: <span class="state-label">{{ currentState }}</span></h2>
        
        <div class="button-row">
          <button 
            *ngFor="let state of availableStates" 
            (click)="changeState(state)"
            [class.active]="currentState === state"
            class="state-button"
          >
            {{ state }}
          </button>
        </div>
      </div>
      
      <div class="game-view" [ngClass]="currentState">
        <!-- Lobby View -->
        <div *ngIf="currentState === 'lobby'" class="lobby-view">
          <h3>Game Lobby</h3>
          <div class="theme-selection">
            <h4>Select a Theme:</h4>
            <div class="theme-cards">
              <div 
                *ngFor="let theme of availableThemes" 
                class="theme-card"
                (click)="selectTheme(theme)"
                [class.selected]="selectedTheme?.id === theme.id"
              >
                <h5>{{ theme.name }}</h5>
                <p>{{ theme.questions.length }} questions</p>
              </div>
            </div>
          </div>
          
          <div class="player-list">
            <h4>Players:</h4>
            <div class="player-cards">
              <div class="player-card">
                <span class="player-name">You (Host)</span>
                <span class="player-team yellow">Yellow Team</span>
              </div>
              <div class="player-card">
                <span class="player-name">Demo Player 1</span>
                <span class="player-team red">Red Team</span>
              </div>
              <div class="player-card">
                <span class="player-name">Demo Player 2</span>
                <span class="player-team yellow">Yellow Team</span>
              </div>
            </div>
          </div>
          
          <button class="start-button" (click)="changeState('countdown')" [disabled]="!selectedTheme">
            Start Game
          </button>
        </div>
        
        <!-- Countdown View -->
        <div *ngIf="currentState === 'countdown'" class="countdown-view">
          <div class="countdown">{{ countdown }}</div>
          <p class="get-ready">Get Ready!</p>
        </div>
        
        <!-- Question View -->
        <div *ngIf="currentState === 'question'" class="question-view">
          <h3 *ngIf="currentQuestion">Question {{ currentQuestionIndex + 1 }}</h3>
          <div class="question-card" *ngIf="currentQuestion">
            <h4>{{ currentQuestion.text }}</h4>
            
            <div *ngIf="!currentQuestion.isNumeric">
              <div class="options-list">
                <button 
                  *ngFor="let option of currentQuestion.options" 
                  class="option-button"
                  (click)="selectAnswer(option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            
            <div *ngIf="currentQuestion.isNumeric" class="numeric-input">
              <input 
                type="number" 
                [(ngModel)]="numericAnswer" 
                placeholder="Enter your answer"
              >
              <button (click)="selectAnswer(numericAnswer)">Submit</button>
            </div>
          </div>
          
          <div class="timer">
            Time left: {{ timer }} seconds
          </div>
        </div>
        
        <!-- Voting View -->
        <div *ngIf="currentState === 'voting'" class="voting-view">
          <h3>Voting</h3>
          <p>All answers have been submitted.</p>
          <p>The host is reviewing the answers...</p>
          
          <div class="host-controls" *ngIf="currentQuestion">
            <h4>Host Controls</h4>
            <p>Select the correct answer:</p>
            
            <div *ngIf="!currentQuestion.isNumeric">
              <div class="options-list">
                <button 
                  *ngFor="let option of currentQuestion.options" 
                  class="option-button"
                  (click)="setCorrectAnswer(option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            
            <div *ngIf="currentQuestion.isNumeric" class="numeric-input">
              <input 
                type="number" 
                [(ngModel)]="correctAnswer" 
                placeholder="Enter correct answer"
              >
              <button (click)="setCorrectAnswer(correctAnswer)">Set Correct Answer</button>
            </div>
          </div>
        </div>
        
        <!-- Scoreboard View -->
        <div *ngIf="currentState === 'scoreboard'" class="scoreboard-view">
          <h3>Scoreboard</h3>
          
          <div class="correct-answer" *ngIf="currentQuestion">
            <h4>Correct Answer:</h4>
            <div class="answer-display">{{ correctAnswer }}</div>
          </div>
          
          <div class="scores">
            <h4>Current Scores:</h4>
            <div class="score-list">
              <div class="score-item">
                <span class="player-name">You</span>
                <span class="score">1000</span>
              </div>
              <div class="score-item">
                <span class="player-name">Demo Player 1</span>
                <span class="score">750</span>
              </div>
              <div class="score-item">
                <span class="player-name">Demo Player 2</span>
                <span class="score">850</span>
              </div>
            </div>
          </div>
          
          <button class="next-button" (click)="nextQuestion()">
            Next Question
          </button>
        </div>
        
        <!-- Finished View -->
        <div *ngIf="currentState === 'finished'" class="finished-view">
          <h3>Game Finished!</h3>
          
          <div class="final-scores">
            <h4>Final Scores:</h4>
            <div class="score-list">
              <div class="score-item winner">
                <span class="player-name">You</span>
                <span class="score">2850</span>
                <span class="winner-badge">Winner!</span>
              </div>
              <div class="score-item">
                <span class="player-name">Demo Player 2</span>
                <span class="score">2450</span>
              </div>
              <div class="score-item">
                <span class="player-name">Demo Player 1</span>
                <span class="score">1950</span>
              </div>
            </div>
          </div>
          
          <div class="team-scores">
            <h4>Team Scores:</h4>
            <div class="team-score-container">
              <div class="team-score yellow">
                <span class="team-name">Yellow Team</span>
                <span class="team-score-value">5300</span>
              </div>
              <div class="team-score red">
                <span class="team-name">Red Team</span>
                <span class="team-score-value">1950</span>
              </div>
            </div>
          </div>
          
          <button class="new-game-button" (click)="resetGame()">
            New Game
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flow-demo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1, h2, h3, h4 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .state-controls {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .state-label {
      text-transform: uppercase;
      font-weight: bold;
      color: #2196F3;
    }
    
    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }
    
    .state-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background-color: #e0e0e0;
      cursor: pointer;
    }
    
    .state-button.active {
      background-color: #2196F3;
      color: white;
    }
    
    .game-view {
      background-color: #fff;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-height: 400px;
    }
    
    /* Lobby Styles */
    .theme-cards, .player-cards {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    
    .theme-card {
      flex: 1 0 200px;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .theme-card:hover {
      background-color: #e0e0e0;
    }
    
    .theme-card.selected {
      background-color: #2196F3;
      color: white;
    }
    
    .player-card {
      flex: 1 0 150px;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
    }
    
    .player-team {
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-align: center;
    }
    
    .player-team.yellow {
      background-color: #FFC107;
      color: #333;
    }
    
    .player-team.red {
      background-color: #F44336;
      color: white;
    }
    
    .start-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.25rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .start-button:hover {
      background-color: #45a049;
    }
    
    .start-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    /* Countdown Styles */
    .countdown-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
    }
    
    .countdown {
      font-size: 10rem;
      font-weight: bold;
      color: #2196F3;
      animation: pulse 1s infinite;
    }
    
    .get-ready {
      font-size: 2rem;
      color: #555;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    /* Question Styles */
    .question-card {
      background-color: #f5f5f5;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    
    .option-button {
      padding: 1rem;
      border: none;
      border-radius: 6px;
      background-color: #e0e0e0;
      text-align: left;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .option-button:hover {
      background-color: #2196F3;
      color: white;
    }
    
    .numeric-input {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .numeric-input input {
      flex: 1;
      padding: 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    
    .numeric-input button {
      padding: 1rem 2rem;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .timer {
      text-align: center;
      font-size: 1.25rem;
      color: #F44336;
    }
    
    /* Voting Styles */
    .host-controls {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }
    
    /* Scoreboard Styles */
    .correct-answer {
      margin-bottom: 2rem;
    }
    
    .answer-display {
      background-color: #4CAF50;
      color: white;
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
      font-size: 1.5rem;
    }
    
    .score-list {
      background-color: #f5f5f5;
      border-radius: 6px;
      overflow: hidden;
    }
    
    .score-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .score-item:last-child {
      border-bottom: none;
    }
    
    .score-item.winner {
      background-color: #FFC107;
      color: #333;
      position: relative;
    }
    
    .winner-badge {
      position: absolute;
      right: 8px;
      top: 8px;
      background-color: #F44336;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    
    .score {
      font-weight: bold;
    }
    
    .next-button, .new-game-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.25rem;
      cursor: pointer;
      margin-top: 2rem;
      transition: background-color 0.2s;
    }
    
    .next-button:hover, .new-game-button:hover {
      background-color: #1976D2;
    }
    
    /* Finished Styles */
    .team-score-container {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .team-score {
      flex: 1;
      padding: 1rem;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .team-score.yellow {
      background-color: #FFC107;
      color: #333;
    }
    
    .team-score.red {
      background-color: #F44336;
      color: white;
    }
    
    .team-name {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .team-score-value {
      font-size: 2rem;
      font-weight: bold;
    }
    
    .new-game-button {
      background-color: #4CAF50;
    }
    
    .new-game-button:hover {
      background-color: #45a049;
    }
  `]
})
export class GameFlowDemoComponent implements OnInit {
  // Game state
  availableStates: string[] = Object.values(GameStatus);
  currentState: string = GameStatus.LOBBY;
  
  // Mock data
  availableThemes: Theme[] = [];
  selectedTheme: Theme | null = null;
  currentQuestionIndex: number = 0;
  currentQuestion: any = null;
  
  // UI state
  countdown: number = 3;
  timer: number = 30;
  numericAnswer: number | null = null;
  correctAnswer: any = null;
  
  constructor(@Inject('DataService') private dataService: any) {}
  
  ngOnInit(): void {
    // Get mock themes
    this.availableThemes = this.dataService.getAvailableThemes();
    
    // Start countdown timer when in countdown state
    setInterval(() => {
      if (this.currentState === GameStatus.COUNTDOWN) {
        this.countdown--;
        if (this.countdown <= 0) {
          this.changeState(GameStatus.QUESTION);
          this.countdown = 3;
        }
      }
      
      if (this.currentState === GameStatus.QUESTION) {
        this.timer--;
        if (this.timer <= 0) {
          this.changeState(GameStatus.VOTING);
          this.timer = 30;
        }
      }
    }, 1000);
  }
  
  changeState(state: string): void {
    this.currentState = state;
    
    if (state === GameStatus.QUESTION) {
      if (this.selectedTheme) {
        this.currentQuestion = this.selectedTheme.questions[this.currentQuestionIndex];
      }
    }
  }
  
  selectTheme(theme: Theme): void {
    this.selectedTheme = theme;
  }
  
  selectAnswer(answer: any): void {
    this.correctAnswer = answer; // For demonstration purposes
    this.changeState(GameStatus.VOTING);
  }
  
  setCorrectAnswer(answer: any): void {
    this.correctAnswer = answer;
    this.changeState(GameStatus.SCOREBOARD);
  }
  
  nextQuestion(): void {
    if (this.selectedTheme) {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= this.selectedTheme.questions.length) {
        this.changeState(GameStatus.FINISHED);
      } else {
        this.currentQuestion = this.selectedTheme.questions[this.currentQuestionIndex];
        this.changeState(GameStatus.COUNTDOWN);
      }
    }
  }
  
  resetGame(): void {
    this.currentState = GameStatus.LOBBY;
    this.selectedTheme = null;
    this.currentQuestionIndex = 0;
    this.correctAnswer = null;
    this.numericAnswer = null;
  }
} 