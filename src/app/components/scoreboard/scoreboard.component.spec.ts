import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreboardComponent } from './scoreboard.component';
import { Player, Team } from '../../models/game.models';

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;

  const mockPlayers: Player[] = [
    {
      id: '1',
      name: 'Player 1',
      team: Team.YELLOW,
      score: 100,
      isHost: true
    },
    {
      id: '2',
      name: 'Player 2',
      team: Team.YELLOW,
      score: 150,
      isHost: false
    },
    {
      id: '3',
      name: 'Player 3',
      team: Team.RED,
      score: 200,
      isHost: false
    },
    {
      id: '4',
      name: 'Player 4',
      team: Team.RED,
      score: 50,
      isHost: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardComponent);
    component = fixture.componentInstance;
    component.players = mockPlayers;
    component.totalQuestions = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display team scores', () => {
    const compiled = fixture.nativeElement;
    const teamCards = compiled.querySelectorAll('.team-card');
    expect(teamCards.length).toBe(2);

    const yellowTeam = teamCards[0];
    expect(yellowTeam.querySelector('.team-name').textContent).toContain('Team Yellow');
    expect(yellowTeam.querySelector('.team-score').textContent).toBe('250');

    const redTeam = teamCards[1];
    expect(redTeam.querySelector('.team-name').textContent).toContain('Team Red');
    expect(redTeam.querySelector('.team-score').textContent).toBe('250');
  });

  it('should display player stats', () => {
    const compiled = fixture.nativeElement;
    const playerCards = compiled.querySelectorAll('.player-card');
    expect(playerCards.length).toBe(4);

    const firstPlayer = playerCards[0];
    expect(firstPlayer.querySelector('.player-name').textContent).toBe('Player 1');
    expect(firstPlayer.querySelector('.team-badge').textContent).toBe('yellow');
    expect(firstPlayer.querySelector('.player-score').textContent).toBe('100');
  });

  it('should calculate and display game stats', () => {
    const compiled = fixture.nativeElement;
    const statValues = compiled.querySelectorAll('.stat-value');

    expect(statValues[0].textContent).toBe('125'); // Average score
    expect(statValues[1].textContent).toBe('200'); // Highest score
    expect(statValues[2].textContent).toBe('10'); // Total questions
  });

  it('should handle empty player list', () => {
    component.players = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const teamCards = compiled.querySelectorAll('.team-card');
    const playerCards = compiled.querySelectorAll('.player-card');
    const statValues = compiled.querySelectorAll('.stat-value');

    expect(teamCards.length).toBe(2);
    expect(playerCards.length).toBe(0);
    expect(statValues[0].textContent).toBe('0'); // Average score
    expect(statValues[1].textContent).toBe('0'); // Highest score
  });
}); 