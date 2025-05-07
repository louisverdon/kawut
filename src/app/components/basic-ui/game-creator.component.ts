import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Team, Theme } from '../../models/game.models';

@Component({
  selector: 'app-game-creator',
  template: `
    <div class="creator-container">
      <h2>Create New Game</h2>
      
      <div class="form-section">
        <label for="hostName">Your Name</label>
        <input 
          type="text" 
          id="hostName" 
          [(ngModel)]="hostName" 
          class="form-control"
          placeholder="Enter your name"
        >
      </div>
      
      <div class="form-section">
        <label>Select Your Team</label>
        <div class="team-selector">
          <button 
            [class.active]="selectedTeam === 'yellow'"
            (click)="selectTeam('yellow')"
            class="team-button yellow"
          >
            Yellow Team
          </button>
          <button 
            [class.active]="selectedTeam === 'red'"
            (click)="selectTeam('red')"
            class="team-button red"
          >
            Red Team
          </button>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Game Options</h3>
        <div class="option-group">
          <label>
            <input type="checkbox" [(ngModel)]="options.useTimer">
            Enable Timer
          </label>
          
          <label>
            <input type="checkbox" [(ngModel)]="options.showScoreboard">
            Show Scoreboard After Each Question
          </label>
          
          <label>
            <input type="checkbox" [(ngModel)]="options.allowTeamChat">
            Allow Team Chat
          </label>
        </div>
      </div>
      
      <div class="mock-themes">
        <h3>Available Themes</h3>
        <div class="theme-list">
          <div 
            *ngFor="let theme of mockThemes" 
            class="theme-card"
            [class.selected]="selectedTheme === theme.id"
            (click)="selectTheme(theme.id)"
          >
            <h4>{{ theme.name }}</h4>
            <p>{{ theme.questions }} questions</p>
          </div>
        </div>
      </div>
      
      <div class="qr-section" *ngIf="sessionCreated">
        <h3>Share This Game</h3>
        <p>Let other players join by scanning this QR code:</p>
        
        <app-qr-code 
          [sessionId]="sessionId" 
          [displayText]="'Ask players to scan to join'"
        ></app-qr-code>
        
        <div class="session-code">
          <p>Or share this code: <strong>{{ sessionId }}</strong></p>
        </div>
      </div>
      
      <button 
        class="create-button" 
        (click)="createGame()"
        [disabled]="!canCreateGame()"
        *ngIf="!sessionCreated"
      >
        Create Game Session
      </button>
      
      <button 
        class="start-button" 
        (click)="startGame()"
        *ngIf="sessionCreated"
      >
        Start Game
      </button>
    </div>
  `,
  styles: [`
    .creator-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
    
    .form-section {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    .team-selector {
      display: flex;
      gap: 1rem;
    }
    
    .team-button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .team-button.yellow {
      background-color: #FFC107;
      color: #333;
    }
    
    .team-button.red {
      background-color: #F44336;
      color: white;
    }
    
    .team-button.active {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .option-group {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
    }
    
    .option-group label {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: normal;
    }
    
    .option-group input {
      margin-right: 0.5rem;
    }
    
    .theme-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
    
    .theme-card {
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 4px;
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
    
    .theme-card h4 {
      margin: 0 0 0.5rem 0;
    }
    
    .theme-card p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }
    
    .qr-section {
      margin: 2rem 0;
      text-align: center;
    }
    
    .session-code {
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .create-button, .start-button {
      display: block;
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .create-button {
      background-color: #4CAF50;
      color: white;
    }
    
    .create-button:hover {
      background-color: #45a049;
    }
    
    .create-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .start-button {
      background-color: #2196F3;
      color: white;
    }
    
    .start-button:hover {
      background-color: #1976D2;
    }
  `]
})
export class GameCreatorComponent {
  hostName: string = '';
  selectedTeam: string = '';
  selectedTheme: string = '';
  sessionId: string = '';
  sessionCreated: boolean = false;
  
  options = {
    useTimer: true,
    showScoreboard: true,
    allowTeamChat: false
  };
  
  mockThemes = [
    { id: 'general', name: 'General Knowledge', questions: 10 },
    { id: 'movies', name: 'Movies & TV', questions: 15 },
    { id: 'science', name: 'Science & Tech', questions: 12 },
    { id: 'history', name: 'History', questions: 8 },
    { id: 'sports', name: 'Sports', questions: 10 },
    { id: 'music', name: 'Music', questions: 12 }
  ];
  
  constructor(private router: Router) {}
  
  selectTeam(team: string): void {
    this.selectedTeam = team;
  }
  
  selectTheme(themeId: string): void {
    this.selectedTheme = themeId;
  }
  
  canCreateGame(): boolean {
    return this.hostName.trim().length > 0 && this.selectedTeam.length > 0 && this.selectedTheme.length > 0;
  }
  
  createGame(): void {
    // Generate a random session ID
    this.sessionId = 'GAME' + Math.random().toString(36).substring(2, 7).toUpperCase();
    this.sessionCreated = true;
  }
  
  startGame(): void {
    // Navigate to game screen with session ID
    this.router.navigate(['/game', this.sessionId]);
  }
} 