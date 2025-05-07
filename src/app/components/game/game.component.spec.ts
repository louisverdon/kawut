import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameComponent } from './game.component';
import { GameService } from '../../services/game.service';
import { GameSession, GameStatus, Player, Team } from '../../models/game.models';
import { of } from 'rxjs';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;

  const mockPlayers: Player[] = [
    {
      id: '1',
      name: 'Player 1',
      team: Team.YELLOW,
      score: 0,
      isHost: true
    },
    {
      id: '2',
      name: 'Player 2',
      team: Team.RED,
      score: 0,
      isHost: false
    }
  ];

  const mockSession: GameSession = {
    id: 'test-session',
    status: GameStatus.LOBBY,
    currentQuestionIndex: 0,
    players: {
      '1': mockPlayers[0],
      '2': mockPlayers[1]
    },
    votes: {},
    scores: {},
    countdown: 0
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GameService', ['getCurrentSession']);
    spy.getCurrentSession.and.returnValue(of(mockSession));

    await TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: GameService, useValue: spy }
      ]
    })
    .compileComponents();

    gameServiceSpy = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display waiting screen in lobby state', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.waiting-screen')).toBeTruthy();
    expect(compiled.querySelector('h2').textContent).toContain('Waiting for players');
  });

  it('should display countdown screen in countdown state', () => {
    gameServiceSpy.getCurrentSession.and.returnValue(of({
      ...mockSession,
      status: GameStatus.COUNTDOWN,
      countdown: 3
    }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.countdown-screen')).toBeTruthy();
    expect(compiled.querySelector('.countdown').textContent).toContain('3');
  });

  it('should display question screen in question state', () => {
    const mockQuestion = {
      id: 'q1',
      text: 'Test Question',
      options: ['A', 'B', 'C', 'D'],
      isNumeric: false
    };

    gameServiceSpy.getCurrentSession.and.returnValue(of({
      ...mockSession,
      status: GameStatus.QUESTION,
      currentTheme: {
        id: 'general',
        name: 'General Knowledge',
        questions: [mockQuestion]
      }
    }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.question-screen')).toBeTruthy();
    expect(compiled.querySelector('app-question')).toBeTruthy();
  });

  it('should display scoreboard screen in scoreboard state', () => {
    gameServiceSpy.getCurrentSession.and.returnValue(of({
      ...mockSession,
      status: GameStatus.SCOREBOARD
    }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.scoreboard-screen')).toBeTruthy();
    expect(compiled.querySelector('app-scoreboard')).toBeTruthy();
  });

  it('should display game over screen in finished state', () => {
    gameServiceSpy.getCurrentSession.and.returnValue(of({
      ...mockSession,
      status: GameStatus.FINISHED
    }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.game-over-screen')).toBeTruthy();
    expect(compiled.querySelector('h2').textContent).toContain('Game Over');
  });

  it('should navigate to home when return button is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.goToHome();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
}); 