import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h1>Welcome to Kawut!</h1>
      
      <div class="action-buttons">
        <button class="btn btn-primary" (click)="createGame()">
          Create New Game
        </button>
        
        <div class="join-game">
          <input 
            type="text" 
            [(ngModel)]="sessionId" 
            placeholder="Enter Game Code"
            class="form-control"
          >
          <button 
            class="btn btn-secondary" 
            (click)="joinGame()"
            [disabled]="!sessionId"
          >
            Join Game
          </button>
        </div>
        
        <button class="btn btn-demo" (click)="viewDemo()">
          View Game Flow Demo
        </button>
        
        <div class="standalone-links">
          <h3>Visual Prototype Options</h3>
          <button class="btn btn-standalone" (click)="openCreator()">
            Game Creator (Standalone)
          </button>
          <button class="btn btn-standalone" (click)="openPlayer()">
            Join Sample Game (Standalone)
          </button>
        </div>
      </div>

      <div class="instructions">
        <h2>How to Play</h2>
        <ol>
          <li>Create a new game or join an existing one</li>
          <li>Share the game code with your friends</li>
          <li>Choose a theme and start playing!</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .join-game {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .form-control {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 200px;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }

    .btn-primary:hover {
      background-color: #45a049;
    }

    .btn-secondary {
      background-color: #2196F3;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #1976D2;
    }
    
    .btn-demo {
      background-color: #9C27B0;
      color: white;
    }
    
    .btn-demo:hover {
      background-color: #7B1FA2;
    }
    
    .standalone-links {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .standalone-links h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      color: #555;
    }
    
    .btn-standalone {
      background-color: #FF9800;
      color: white;
      margin: 0.5rem;
    }
    
    .btn-standalone:hover {
      background-color: #F57C00;
    }

    .btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .instructions {
      text-align: left;
      background-color: #f5f5f5;
      padding: 2rem;
      border-radius: 8px;
    }

    .instructions h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .instructions ol {
      margin-left: 1.5rem;
    }

    .instructions li {
      margin-bottom: 0.5rem;
      color: #666;
    }
  `]
})
export class HomeComponent {
  sessionId: string = '';

  constructor(
    private router: Router,
    private gameService: GameService
  ) {}

  createGame() {
    this.gameService.createGame().subscribe({
      next: (sessionId) => {
        this.router.navigate(['/lobby', sessionId]);
      },
      error: (error) => {
        console.error('Error creating game:', error);
        // TODO: Show error message to user
      }
    });
  }

  joinGame() {
    if (this.sessionId) {
      this.router.navigate(['/lobby', this.sessionId]);
    }
  }
  
  viewDemo() {
    this.router.navigate(['/demo']);
  }
  
  openCreator() {
    this.router.navigate(['/create']);
  }
  
  openPlayer() {
    // Use a sample session ID for the standalone player demo
    const demoSessionId = 'DEMO123';
    this.router.navigate(['/play', demoSessionId]);
  }
} 