import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import { QuestionComponent } from './components/question/question.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { QRCodeComponent } from './components/qrcode/qrcode.component';
import { GameFlowDemoComponent } from './components/game-flow-demo/game-flow-demo.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { GameCreatorComponent } from './components/basic-ui/game-creator.component';
import { GamePlayerComponent } from './components/basic-ui/game-player.component';

import { GameService } from './services/game.service';
import { FirebaseService } from './services/firebase.service';
import { MockDataService } from './services/mock-data.service';

// Flag to use mock data instead of Firebase (for local testing)
const USE_MOCK_DATA = true;

// Create a mock FirebaseService
class MockFirebaseService {
  // Add stub methods that would be used
  createGameSession() { return of('mock-session'); }
  getGameSession() { return of(null); }
  joinGame() { return of(undefined); }
  updateGameStatus() { return of(undefined); }
  setCurrentTheme() { return of(undefined); }
  submitVote() { return of(undefined); }
  updateScore() { return of(undefined); }
  updateCountdown() { return of(undefined); }
  leaveGame() { return Promise.resolve(); }
  removePlayer() { return Promise.resolve(); }
}

// Factory function to provide either Firebase or Mock service
export function dataServiceFactory(firebaseService: any, mockDataService: MockDataService) {
  return USE_MOCK_DATA ? mockDataService : firebaseService;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LobbyComponent,
    GameComponent,
    QuestionComponent,
    ScoreboardComponent,
    QRCodeComponent,
    GameFlowDemoComponent,
    QrCodeComponent,
    GameCreatorComponent,
    GamePlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'lobby/:sessionId', component: LobbyComponent },
      { path: 'game/:sessionId', component: GameComponent },
      { path: 'demo', component: GameFlowDemoComponent },
      { path: 'create', component: GameCreatorComponent },
      { path: 'play/:sessionId', component: GamePlayerComponent },
      { path: '**', redirectTo: '' }
    ]),
    // Only initialize Firebase if we're not using mock data
    ...(USE_MOCK_DATA ? [] : [
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule,
      AngularFireAuthModule
    ])
  ],
  providers: [
    GameService,
    MockDataService,
    // Conditionally provide real or mock FirebaseService
    {
      provide: FirebaseService,
      useClass: USE_MOCK_DATA ? MockFirebaseService : FirebaseService
    },
    {
      provide: 'DataService',
      useFactory: dataServiceFactory,
      deps: [FirebaseService, MockDataService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 