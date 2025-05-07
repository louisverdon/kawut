# Kawut - Interactive Quiz Game

Kawut is an Angular-based multiplayer quiz/game application with Firebase integration, featuring real-time gameplay, QR code functionality, and interactive scoring.

## Features

- Real-time multiplayer gameplay
- QR code joining functionality
- Team-based competition
- Interactive scoring system
- Themable quiz questions

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/kawut` directory.

## Running Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployment to GitHub Pages

The project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment (GitHub Actions)

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy to the gh-pages branch
3. Your app will be available at `https://[your-username].github.io/kawut/`

### Manual Deployment

You can also deploy manually using these commands:

```bash
# Build the application with the correct base href
npm run build:prod

# Deploy to GitHub Pages
npm run deploy
```

## Configuration Notes

- The application uses Angular 16.2.0
- Firebase integration is available for real-time features
- The application is configured to handle client-side routing on GitHub Pages

## Project Structure

- `src/app/components`: Angular components
- `src/app/services`: Services for game logic and data management
- `src/app/models`: TypeScript interfaces and models

## QR Code Functionality

When a game is created:
1. A QR code is displayed in the lobby
2. Users can scan the code to join directly
3. A form appears for name and team selection
4. After form submission, users enter the lobby

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 