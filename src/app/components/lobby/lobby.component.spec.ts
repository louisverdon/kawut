import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LobbyComponent } from './lobby.component';
import { GameService } from '../../services/game.service';
import { Player, Team } from '../../models/game.models';
import { of } from 'rxjs';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;

  const mockPlayers: Player[] = [
    {
      id: '1',
      name: 'Host Player',
      team: Team.YELLOW,
      score: 0,
      isHost: true
    },
    {
      id: '2',
      name: 'Regular Player',
      team: Team.RED,
      score: 0,
      isHost: false
    }
  ];

  const mockSession = {
    id: 'test-session',
    status: 'lobby',
    currentQuestionIndex: 0,
    players: {
      '1': mockPlayers[0],
      '2': mockPlayers[1]
    },
    votes: {},
    scores: {},
    countdown: 0
  };

  const mockTheme = {
    id: 'general',
    name: 'General Knowledge',
    questions: [
      {
        id: 'q1',
        text: 'Test Question',
        options: ['A', 'B', 'C', 'D'],
        isNumeric: false
      }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GameService', [
      'getCurrentSession',
      'getCurrentPlayer',
      'startGame',
      'leaveGame'
    ]);

    spy.getCurrentSession.and.returnValue(of(mockSession));
    spy.getCurrentPlayer.and.returnValue(of(mockPlayers[0]));
    spy.startGame.and.returnValue(of(void 0));
    spy.leaveGame.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [ LobbyComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: GameService, useValue: spy }
      ]
    })
    .compileComponents();

    gameServiceSpy = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display player list', () => {
    const compiled = fixture.nativeElement;
    const playerCards = compiled.querySelectorAll('.player-card');
    expect(playerCards.length).toBe(2);
    expect(playerCards[0].textContent).toContain('Host Player');
    expect(playerCards[1].textContent).toContain('Regular Player');
  });

  it('should show host badge for host player', () => {
    const compiled = fixture.nativeElement;
    const hostBadge = compiled.querySelector('.host-badge');
    expect(hostBadge).toBeTruthy();
    expect(hostBadge.textContent).toContain('Host');
  });

  it('should show start game button for host', () => {
    const compiled = fixture.nativeElement;
    const startButton = compiled.querySelector('.btn-primary');
    expect(startButton).toBeTruthy();
    expect(startButton.textContent).toContain('Start Game');
  });

  it('should show ready button for non-host players', () => {
    gameServiceSpy.getCurrentPlayer.and.returnValue(of(mockPlayers[1]));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const readyButton = compiled.querySelector('.btn-primary');
    expect(readyButton).toBeTruthy();
    expect(readyButton.textContent).toContain('Ready');
  });

  it('should load themes on init', () => {
    expect(component.availableThemes.length).toBeGreaterThan(0);
  });

  it('should select theme when clicked', () => {
    component.selectTheme(mockTheme);
    expect(component.selectedTheme).toBe(mockTheme);
  });

  it('should toggle ready state', () => {
    component.toggleReady();
    expect(component.isReady).toBeTrue();
    component.toggleReady();
    expect(component.isReady).toBeFalse();
  });

  it('should start game when conditions are met', () => {
    component.selectedTheme = mockTheme;
    component.startGame();
    expect(gameServiceSpy.startGame).toHaveBeenCalled();
  });

  it('should not start game when conditions are not met', () => {
    component.selectedTheme = null;
    component.startGame();
    expect(gameServiceSpy.startGame).not.toHaveBeenCalled();
  });

  it('should leave game when leave button is clicked', () => {
    component.leaveGame();
    expect(gameServiceSpy.leaveGame).toHaveBeenCalled();
  });
}); 