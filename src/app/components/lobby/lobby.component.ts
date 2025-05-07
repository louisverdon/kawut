import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { GameSession, Player, Team, GameStatus } from '../../models/game.models';

@Component({
  selector: 'app-lobby',
  template: `
    <div class="lobby-container">
      <!-- Join Game Form when accessed via QR code -->
      <div *ngIf="showJoinForm" class="join-form-container card">
        <h2>Join Game</h2>
        <p class="session-id">Game Code: {{sessionId}}</p>
        
        <div class="form-group">
          <label for="playerName">Your Name</label>
          <input 
            type="text" 
            id="playerName" 
            [(ngModel)]="playerName" 
            class="form-control"
            placeholder="Enter your name"
            required
          >
        </div>
        
        <div class="form-group">
          <label>Select Team</label>
          <div class="team-selector">
            <div 
              class="team-option team-blue" 
              [class.selected]="selectedTeam === 'blue'"
              (click)="selectedTeam = 'blue'">
              Blue
            </div>
            <div 
              class="team-option team-red" 
              [class.selected]="selectedTeam === 'red'"
              (click)="selectedTeam = 'red'">
              Red
            </div>
          </div>
        </div>
        
        <button 
          class="btn btn-primary" 
          [disabled]="!playerName || !selectedTeam"
          (click)="joinGameWithForm()">
          Join Game
        </button>
      </div>

      <!-- Regular Lobby View -->
      <div *ngIf="!showJoinForm" class="card">
        <h2>Game Lobby</h2>
        <p class="session-id">Game Code: {{sessionId}}</p>

        <!-- QR Code for joining -->
        <app-qr-code *ngIf="isHost" [sessionId]="sessionId"></app-qr-code>

        <!-- Player List -->
        <div class="players-section">
          <h3>Players ({{players.length}})</h3>
          <div class="players-list">
            <div *ngFor="let player of players" class="player-card">
              <div class="player-info">
                <span class="player-name team-{{player.team}}">{{player.name}}</span>
                <span *ngIf="player.isHost" class="host-badge">Host</span>
              </div>
              <div class="player-status">
                <span class="status-dot" [class.ready]="isPlayerReady(player)"></span>
                <span class="status-text">{{isPlayerReady(player) ? 'Ready' : 'Not Ready'}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Selection (Host Only) -->
        <div *ngIf="isHost" class="theme-section">
          <h3>Select Theme</h3>
          <div class="theme-grid">
            <div 
              *ngFor="let theme of availableThemes" 
              class="theme-card"
              [class.selected]="selectedTheme?.id === theme.id"
              (click)="selectTheme(theme)">
              <h4>{{theme.name}}</h4>
              <p>{{theme.questions.length}} questions</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions">
          <button 
            *ngIf="isHost" 
            class="btn btn-primary" 
            [disabled]="!canStartGame"
            (click)="startGame()">
            Start Game
          </button>
          <button 
            *ngIf="!isHost" 
            class="btn btn-primary" 
            [disabled]="!canReady"
            (click)="toggleReady()">
            {{isReady ? 'Not Ready' : 'Ready'}}
          </button>
          <button 
            class="btn btn-secondary" 
            (click)="leaveGame()">
            Leave Game
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lobby-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .card {
      width: 100%;
      max-width: 800px;
      text-align: center;
      background: rgba(32, 32, 32, 0.8);
    }

    h2 {
      font-size: 2.5em;
      margin-bottom: 20px;
      color: #fff;
    }

    .session-id {
      font-size: 1.2em;
      color: #4CAF50;
      margin-bottom: 30px;
    }

    .players-section {
      margin: 30px 0;
    }

    h3 {
      font-size: 1.5em;
      color: #fff;
      margin-bottom: 20px;
    }

    .players-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .player-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .player-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .player-name {
      font-size: 1.2em;
    }

    .host-badge {
      background: #FFD700;
      color: #000;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
    }

    .player-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff4444;
    }

    .status-dot.ready {
      background: #4CAF50;
    }

    .status-text {
      color: #ccc;
    }

    .theme-section {
      margin: 30px 0;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .theme-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .theme-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .theme-card.selected {
      background: rgba(76, 175, 80, 0.2);
      border: 2px solid #4CAF50;
    }

    .theme-card h4 {
      color: #fff;
      margin-bottom: 10px;
    }

    .theme-card p {
      color: #ccc;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Join Form Styles */
    .join-form-container {
      background: rgba(0, 0, 0, 0.7);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 25px;
      text-align: left;
    }

    label {
      display: block;
      color: #fff;
      font-size: 1.1em;
      margin-bottom: 8px;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      color: #fff;
    }

    .team-selector {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 10px;
    }

    .team-option {
      flex: 1;
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    }

    .team-blue {
      background: rgba(33, 150, 243, 0.2);
      color: #2196F3;
    }

    .team-red {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
    }

    .team-option.selected {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .team-blue.selected {
      background: rgba(33, 150, 243, 0.4);
      border: 2px solid #2196F3;
    }

    .team-red.selected {
      background: rgba(244, 67, 54, 0.4);
      border: 2px solid #F44336;
    }

    .btn-primary {
      background: #4CAF50;
      color: white;
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #3d8c40;
    }

    /* QR Code Container Styling */
    app-qr-code {
      display: block;
      margin: 20px auto;
      padding: 10px;
      background: #333;
      border-radius: 10px;
      width: fit-content;
    }
  `]
})
export class LobbyComponent implements OnInit, OnDestroy {
  sessionId = '';
  players: Player[] = [];
  isHost = false;
  isReady = false;
  selectedTheme: any = null;
  availableThemes: any[] = [];
  private subscriptions: Subscription[] = [];

  // For QR code direct join functionality
  showJoinForm = false;
  playerName = '';
  selectedTeam: 'red' | 'blue' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.params['sessionId'];
    this.loadThemes();
    
    // Check if this is a direct join from QR code or if user already joined from home
    const directParam = this.route.snapshot.queryParamMap.get('direct');
    const joinedParam = this.route.snapshot.queryParamMap.get('joined');
    
    console.log('Direct parameter:', directParam);
    console.log('Joined parameter:', joinedParam);
    
    // Skip join form if user already joined via home screen
    if (joinedParam === 'true') {
      this.showJoinForm = false;
      this.subscribeToGameUpdates();
      return;
    }
    
    // Check if the user is already connected to this session
    this.gameService.getCurrentPlayer().subscribe(player => {
      const hasActiveSession = !!player;
      console.log('User has active session:', hasActiveSession);
      
      // Show join form if direct=true OR if user doesn't have an active session
      this.showJoinForm = directParam === 'true' || !hasActiveSession;
      console.log('showJoinForm set to:', this.showJoinForm);
      
      // Subscribe to game updates only if user has an active session
      if (hasActiveSession) {
        this.subscribeToGameUpdates();
      }
    });
    
    // Also keep the route parameter subscription for navigation within component
    this.route.queryParams.subscribe(params => {
      console.log('Query params updated:', params);
      if (params['direct'] === 'true') {
        this.showJoinForm = true;
        console.log('showJoinForm set to true by query params');
      } else if (params['joined'] === 'true') {
        this.showJoinForm = false;
        console.log('showJoinForm set to false because user already joined');
      }
    });
  }

  private subscribeToGameUpdates(): void {
    // Subscribe to game session updates
    this.subscriptions.push(
      this.gameService.getCurrentSession().subscribe(session => {
        if (!session) {
          console.log('Received null session');
          return;
        }
        
        console.log('Session updated in lobby:', session);
        console.log('Players in session:', session.players);
        
        if (session.players) {
          this.players = Object.values(session.players);
          console.log('Players array updated:', this.players);
        } else {
          console.log('No players object in session');
          this.players = [];
        }
      })
    );

    // Subscribe to current player updates
    this.subscriptions.push(
      this.gameService.getCurrentPlayer().subscribe(player => {
        if (!player) {
          console.log('Received null player');
          return;
        }
        
        console.log('Current player updated:', player);
        this.isHost = player.isHost;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadThemes(): void {
    // Placeholder for loading themes from service
    this.availableThemes = [
      { id: 1, name: 'General Knowledge', questions: [{}, {}, {}] },
      { id: 2, name: 'Movies & TV', questions: [{}, {}, {}, {}] },
      { id: 3, name: 'Science & Nature', questions: [{}, {}, {}] }
    ];
  }

  joinGameWithForm(): void {
    if (this.playerName && this.selectedTeam) {
      // Join the game with the provided name and team
      this.gameService.joinSession(
        this.sessionId, 
        this.playerName, 
        this.selectedTeam as Team, 
        false // Not a host
      ).subscribe({
        next: () => {
          // Hide the form and show the lobby
          this.showJoinForm = false;
          // Now subscribe to game updates
          this.subscribeToGameUpdates();
        },
        error: (error) => {
          console.error('Error joining game:', error);
          // TODO: Show error message to user
        }
      });
    }
  }

  get canStartGame(): boolean {
    return this.isHost && !!this.selectedTheme && this.players.length > 0;
  }

  get canReady(): boolean {
    return !this.isHost;
  }

  isPlayerReady(player: Player): boolean {
    // Simple placeholder for ready status
    return true;
  }

  selectTheme(theme: any): void {
    this.selectedTheme = theme;
  }

  toggleReady(): void {
    this.isReady = !this.isReady;
  }

  startGame(): void {
    if (this.canStartGame && this.sessionId && this.selectedTheme) {
      this.gameService.startGame(this.sessionId, this.selectedTheme).subscribe({
        next: () => this.router.navigate(['/game', this.sessionId]),
        error: (error) => console.error('Error starting game:', error)
      });
    }
  }

  leaveGame(): void {
    if (this.sessionId) {
      this.gameService.leaveGame(this.sessionId).then(() => {
        this.router.navigate(['/']);
      });
    }
  }
} 