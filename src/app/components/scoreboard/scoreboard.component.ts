import { Component, Input } from '@angular/core';
import { Player, Team } from '../../models/game.models';

interface TeamScore {
  id: string;
  name: string;
  score: number;
  players: Player[];
}

@Component({
  selector: 'app-scoreboard',
  template: `
    <div class="scoreboard-container">
      <!-- Team Scores -->
      <div class="team-scores">
        <h3>Team Scores</h3>
        <div class="team-grid">
          <div *ngFor="let team of teamScores" class="team-card">
            <h4 class="team-name team-{{team.id}}">{{ team.name }}</h4>
            <div class="team-score">{{ team.score }}</div>
          </div>
        </div>
      </div>

      <!-- Player Stats -->
      <div class="player-stats">
        <h3>Player Stats</h3>
        <div class="player-list">
          <div *ngFor="let player of players" class="player-card">
            <div class="player-info">
              <span class="player-name">{{ player.name }}</span>
              <span class="team-badge team-{{player.team}}">{{ player.team }}</span>
            </div>
            <div class="player-score">{{ player.score }}</div>
          </div>
        </div>
      </div>

      <!-- Game Stats -->
      <div class="game-stats">
        <h3>Game Stats</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Average Score</span>
            <span class="stat-value">{{ averageScore }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Highest Score</span>
            <span class="stat-value">{{ highestScore }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Questions</span>
            <span class="stat-value">{{ totalQuestions }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scoreboard-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h3 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .team-scores {
      margin-bottom: 2rem;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .team-card {
      padding: 1rem;
      border-radius: 8px;
      background-color: #f8f9fa;
      text-align: center;
    }

    .team-name {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .team-score {
      font-size: 2rem;
      font-weight: bold;
    }

    .player-stats {
      margin-bottom: 2rem;
    }

    .player-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .player-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .player-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .player-name {
      font-weight: 500;
    }

    .team-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .player-score {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .game-stats {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .team-yellow {
      color: #FFD700;
    }

    .team-red {
      color: #FF4444;
    }

    .team-badge.team-yellow {
      background-color: #FFF9C4;
      color: #F57F17;
    }

    .team-badge.team-red {
      background-color: #FFEBEE;
      color: #C62828;
    }
  `]
})
export class ScoreboardComponent {
  @Input() players: Player[] = [];
  @Input() totalQuestions: number = 0;

  get teamScores(): TeamScore[] {
    const teams = new Map<string, TeamScore>();

    // Initialize teams
    Object.values(Team).forEach(team => {
      teams.set(team, {
        id: team,
        name: `Team ${team.charAt(0).toUpperCase() + team.slice(1)}`,
        score: 0,
        players: []
      });
    });

    // Calculate team scores
    this.players.forEach(player => {
      const team = teams.get(player.team);
      if (team) {
        team.players.push(player);
        team.score += player.score;
      }
    });

    return Array.from(teams.values());
  }

  get averageScore(): number {
    if (this.players.length === 0) return 0;
    const total = this.players.reduce((sum, player) => sum + player.score, 0);
    return Math.round(total / this.players.length);
  }

  get highestScore(): number {
    if (this.players.length === 0) return 0;
    return Math.max(...this.players.map(player => player.score));
  }
} 