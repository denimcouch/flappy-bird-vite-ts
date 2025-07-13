# Flappy Bird Clone (Phaser 3 + TypeScript + Vite)

A modern, open-source Flappy Bird clone built with Phaser 3, TypeScript, and Vite. Features classic gameplay, smooth UI, and easily tunable game balance.

## Features

- Classic Flappy Bird gameplay
- Clean, modular codebase using Phaser 3 and TypeScript
- Scenes: Boot, Preloader, MainMenu, Game, GameOver
- Scoring system with local high score persistence
- Pause, restart, and main menu navigation
- Audio feedback for flaps, scoring, and collisions
- Modern loading screen with progress bar
- All game constants centralized for easy tuning

## How to Play

- **Flap:** Click/tap or press SPACE to make the bird flap upward
- **Avoid pipes:** Don’t touch pipes or the ground
- **Score:** Pass through pipes to earn points
- **Pause:** Click the pause button or press P
- **Restart:** After game over, tap/click or press SPACE

## Getting Started

### Requirements

- [Node.js](https://nodejs.org) (v16+ recommended)

### Install & Run

```bash
npm install
npm run dev
```

- Open [http://localhost:1337](http://localhost:1337) (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

- Output is in the `dist/` folder

## Tuning & Customization

- All gameplay constants (gravity, flap force, pipe gap, speed, etc.) are in [`src/game/constants.ts`](src/game/constants.ts)
- Edit these values to adjust difficulty, pacing, and feel

## Project Structure

| Path                       | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `index.html`               | Main HTML page                                                |
| `public/assets`            | Game sprites, audio, etc.                                     |
| `src/game/constants.ts`    | All game constants for tuning                                 |
| `src/game/main.ts`         | Game entry/configuration                                      |
| `src/game/scenes/`         | All Phaser scenes (Boot, Preloader, MainMenu, Game, GameOver) |
| `src/game/AudioManager.ts` | Simple audio system                                           |

## Credits

- Built with [Phaser 3](https://phaser.io/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/)
- Flappy Bird original by .GEARS Studios
- This project is for educational/demo purposes only

---

## License

See [LICENSE](LICENSE).
