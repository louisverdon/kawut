import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../models/game.models';

@Component({
  selector: 'app-game-player',
  template: `
    <div class="player-container">
      <div class="game-header">
        <h2>Session: {{ sessionId }}</h2>
        <div class="player-info" *ngIf="playerJoined">
          <span class="player-name">{{ playerName }}</span>
          <span class="player-team" [ngClass]="playerTeam">{{ playerTeam }}</span>
        </div>
      </div>
      
      <div class="join-form" *ngIf="!playerJoined">
        <h3>Join Game</h3>
        
        <div class="form-group">
          <label for="playerName">Your Name</label>
          <input 
            type="text" 
            id="playerName" 
            [(ngModel)]="playerName" 
            class="form-control"
            placeholder="Enter your name"
          >
        </div>
        
        <div class="form-group">
          <label>Select Your Team</label>
          <div class="team-selector">
            <button 
              [class.active]="playerTeam === 'yellow'"
              (click)="selectTeam('yellow')"
              class="team-button yellow"
            >
              Yellow Team
            </button>
            <button 
              [class.active]="playerTeam === 'red'"
              (click)="selectTeam('red')"
              class="team-button red"
            >
              Red Team
            </button>
          </div>
        </div>
        
        <button 
          class="join-button" 
          (click)="joinGame()"
          [disabled]="!canJoinGame()"
        >
          Join Game
        </button>
      </div>
      
      <div class="waiting-screen" *ngIf="playerJoined && !gameStarted">
        <h3>Waiting for the game to start...</h3>
        
        <div class="players-list">
          <h4>Players in this session:</h4>
          <div class="player-cards">
            <div class="player-card" *ngFor="let player of mockPlayers">
              <span class="player-card-name">{{ player.name }}</span>
              <span class="player-card-team" [ngClass]="player.team">{{ player.team }}</span>
              <span class="host-badge" *ngIf="player.isHost">Host</span>
            </div>
          </div>
        </div>
        
        <div class="team-distribution">
          <div class="team yellow">
            <h5>Yellow Team</h5>
            <div class="team-count">{{ yellowTeamCount }}</div>
          </div>
          <div class="team red">
            <h5>Red Team</h5>
            <div class="team-count">{{ redTeamCount }}</div>
          </div>
        </div>
        
        <p class="waiting-message">The host will start the game soon...</p>
      </div>
      
      <div class="game-screen" *ngIf="playerJoined && gameStarted">
        <h3>Game in Progress</h3>
        <p>This is a placeholder for the actual game UI.</p>
        <p>The game would display questions, options, and allow answering.</p>
        
        <div class="mock-question">
          <h4>Question 1: What is the capital of France?</h4>
          <div class="options">
            <button class="option-button">London</button>
            <button class="option-button correct">Paris</button>
            <button class="option-button">Berlin</button>
            <button class="option-button">Madrid</button>
          </div>
        </div>
        
        <button class="answer-button">Submit Answer</button>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    
    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .player-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .player-name {
      font-weight: 500;
    }
    
    .player-team {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      text-transform: capitalize;
    }
    
    .yellow {
      background-color: #FFC107;
      color: #333;
    }
    
    .red {
      background-color: #F44336;
      color: white;
    }
    
    .join-form {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
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
      transition: all 0.2s;
    }
    
    .team-button.active {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .join-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .join-button:hover {
      background-color: #45a049;
    }
    
    .join-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .waiting-screen {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .players-list {
      margin: 2rem 0;
    }
    
    .player-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
    
    .player-card {
      padding: 0.75rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
      position: relative;
    }
    
    .player-card-name {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .player-card-team {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }
    
    .host-badge {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background-color: #2196F3;
      color: white;
      font-size: 0.7rem;
      padding: 0.15rem 0.3rem;
      border-radius: 4px;
    }
    
    .team-distribution {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin: 2rem 0;
    }
    
    .team {
      padding: 1rem;
      border-radius: 8px;
      min-width: 120px;
    }
    
    .team h5 {
      margin: 0 0 0.5rem 0;
      text-transform: capitalize;
    }
    
    .team-count {
      font-size: 2rem;
      font-weight: bold;
    }
    
    .waiting-message {
      font-style: italic;
      color: #666;
    }
    
    .game-screen {
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .mock-question {
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .option-button {
      padding: 1rem;
      text-align: left;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .option-button:hover {
      background-color: #e0e0e0;
    }
    
    .option-button.correct {
      background-color: #4CAF50;
      color: white;
      border-color: #4CAF50;
    }
    
    .answer-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      margin-top: 2rem;
    }
  `]
})
export class GamePlayerComponent implements OnInit {
  sessionId: string = '';
  playerName: string = '';
  playerTeam: string = '';
  playerJoined: boolean = false;
  gameStarted: boolean = false;
  
  mockPlayers = [
    { name: 'Host User', team: 'yellow', isHost: true },
    { name: 'Player 1', team: 'red', isHost: false },
    { name: 'Player 2', team: 'yellow', isHost: false },
    { name: 'Player 3', team: 'red', isHost: false },
    { name: 'Player 4', team: 'yellow', isHost: false }
  ];
  
  get yellowTeamCount(): number {
    return this.mockPlayers.filter(p => p.team === 'yellow').length;
  }
  
  get redTeamCount(): number {
    return this.mockPlayers.filter(p => p.team === 'red').length;
  }
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('sessionId');
      if (id) {
        this.sessionId = id;
      }
    });
    
    // For demo purposes, auto-start the game after 10 seconds of joining
    setTimeout(() => {
      if (this.playerJoined) {
        this.gameStarted = true;
      }
    }, 10000);
  }
  
  selectTeam(team: string): void {
    this.playerTeam = team;
  }
  
  canJoinGame(): boolean {
    return this.playerName.trim().length > 0 && this.playerTeam.length > 0;
  }
  
  joinGame(): void {
    if (this.canJoinGame()) {
      this.playerJoined = true;
      
      // Add self to the mock players list
      this.mockPlayers.push({
        name: this.playerName,
        team: this.playerTeam,
        isHost: false
      });
    }
  }
} 