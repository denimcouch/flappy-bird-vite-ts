import { Scene } from 'phaser';
import { AudioManager } from '../AudioManager';
import { IS_MOBILE, MOBILE_FONT_SCALE } from '../constants';

interface GameOverData {
  score: number;
  highScore: number;
}

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;
  score_text: Phaser.GameObjects.Text;
  high_score_text: Phaser.GameObjects.Text;
  tap_to_restart_text: Phaser.GameObjects.Text;
  main_menu_text: Phaser.GameObjects.Text;

  // Audio system
  audioManager: AudioManager;

  constructor() {
    super('GameOver');
  }

  create(data: GameOverData) {
    // Initialize audio manager
    this.audioManager = new AudioManager(this);

    // Get responsive dimensions
    const gameWidth = this.sys.canvas.width;
    const gameHeight = this.sys.canvas.height;
    const centerX = gameWidth / 2;
    const centerY = gameHeight / 2;

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1e90ff); // Dodger blue background

    this.background = this.add.image(centerX, centerY, 'background');
    this.background.setAlpha(0.2);

    // Add gradient overlay for depth
    const gradient = this.add.rectangle(
      centerX,
      centerY,
      gameWidth,
      gameHeight,
      0x000000,
      0.3
    );
    gradient.setOrigin(0.5);

    // Game Over title with mobile-responsive styling
    const gameOverFontSize = IS_MOBILE
      ? Math.floor(72 * MOBILE_FONT_SCALE)
      : 72;
    const gameOverY = IS_MOBILE ? centerY - 100 : 200;

    this.gameover_text = this.add.text(centerX, gameOverY, '💀 GAME OVER 💀', {
      fontFamily: 'Arial Black',
      fontSize: gameOverFontSize,
      color: '#FF4500', // Orange-red
      stroke: '#8B0000', // Dark red stroke
      strokeThickness: IS_MOBILE ? 8 : 12,
      align: 'center',
      shadow: {
        offsetX: IS_MOBILE ? 3 : 5,
        offsetY: IS_MOBILE ? 3 : 5,
        color: '#000000',
        blur: IS_MOBILE ? 6 : 10,
        fill: true
      }
    });
    this.gameover_text.setOrigin(0.5);

    // Score display with mobile-responsive styling
    const scoreFontSize = IS_MOBILE ? Math.floor(42 * MOBILE_FONT_SCALE) : 42;
    const scoreY = IS_MOBILE ? gameOverY + 60 : 300;

    this.score_text = this.add.text(
      centerX,
      scoreY,
      `🎯 Score: ${data.score} 🎯`,
      {
        fontFamily: 'Arial Black',
        fontSize: scoreFontSize,
        color: '#FFD700', // Bright gold
        stroke: '#FF4500', // Orange-red stroke
        strokeThickness: IS_MOBILE ? 5 : 8,
        align: 'center',
        shadow: {
          offsetX: IS_MOBILE ? 2 : 3,
          offsetY: IS_MOBILE ? 2 : 3,
          color: '#000000',
          blur: IS_MOBILE ? 3 : 6,
          fill: true
        }
      }
    );
    this.score_text.setOrigin(0.5);

    // High score display with mobile-responsive styling
    const highScoreFontSize = IS_MOBILE
      ? Math.floor(32 * MOBILE_FONT_SCALE)
      : 32;
    const highScoreY = IS_MOBILE ? scoreY + 40 : 350;

    this.high_score_text = this.add.text(
      centerX,
      highScoreY,
      `🏆 Best: ${data.highScore} 🏆`,
      {
        fontFamily: 'Arial Black',
        fontSize: highScoreFontSize,
        color: '#32CD32', // Lime green
        stroke: '#006400', // Dark green stroke
        strokeThickness: IS_MOBILE ? 4 : 6,
        align: 'center',
        shadow: {
          offsetX: IS_MOBILE ? 2 : 3,
          offsetY: IS_MOBILE ? 2 : 3,
          color: '#000000',
          blur: IS_MOBILE ? 3 : 6,
          fill: true
        }
      }
    );
    this.high_score_text.setOrigin(0.5);

    // New high score message with mobile-responsive styling
    if (data.score >= data.highScore && data.score > 0) {
      const newRecordFontSize = IS_MOBILE
        ? Math.floor(32 * MOBILE_FONT_SCALE)
        : 32;
      const newRecordY = IS_MOBILE ? highScoreY + 40 : 400;

      const newRecordText = this.add.text(
        centerX,
        newRecordY,
        '🎉 NEW RECORD! 🎉',
        {
          fontFamily: 'Arial Black',
          fontSize: newRecordFontSize,
          color: '#FF1493', // Deep pink
          stroke: '#8B0000', // Dark red stroke
          strokeThickness: IS_MOBILE ? 5 : 8,
          align: 'center',
          shadow: {
            offsetX: IS_MOBILE ? 2 : 4,
            offsetY: IS_MOBILE ? 2 : 4,
            color: '#000000',
            blur: IS_MOBILE ? 4 : 8,
            fill: true
          }
        }
      );
      newRecordText.setOrigin(0.5);

      // Add celebration animation
      this.tweens.add({
        targets: newRecordText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 500,
        ease: 'Power2',
        yoyo: true,
        repeat: 3
      });
    }

    // Tap to restart instruction with mobile-responsive styling
    const restartFontSize = IS_MOBILE ? Math.floor(28 * MOBILE_FONT_SCALE) : 28;
    const restartY = IS_MOBILE ? highScoreY + 80 : 480;
    const restartText = IS_MOBILE
      ? '🎮 Tap to Play Again 🎮'
      : '🎮 Tap to Play Again 🎮';

    this.tap_to_restart_text = this.add.text(centerX, restartY, restartText, {
      fontFamily: 'Arial Black',
      fontSize: restartFontSize,
      color: '#00FFFF', // Cyan
      stroke: '#000080', // Navy blue stroke
      strokeThickness: IS_MOBILE ? 4 : 6,
      align: 'center',
      shadow: {
        offsetX: IS_MOBILE ? 2 : 3,
        offsetY: IS_MOBILE ? 2 : 3,
        color: '#000000',
        blur: IS_MOBILE ? 3 : 6,
        fill: true
      }
    });
    this.tap_to_restart_text.setOrigin(0.5);

    // Add pulsing animation to restart text
    this.tweens.add({
      targets: this.tap_to_restart_text,
      alpha: 0.6,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1200,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });

    // Main menu option with mobile-responsive styling
    const menuFontSize = IS_MOBILE ? Math.floor(24 * MOBILE_FONT_SCALE) : 24;
    const menuY = IS_MOBILE ? restartY + 40 : 520;
    const menuText = IS_MOBILE
      ? '🏠 Tap M for Main Menu 🏠'
      : '🏠 Press M for Main Menu 🏠';

    this.main_menu_text = this.add.text(centerX, menuY, menuText, {
      fontFamily: 'Arial Black',
      fontSize: menuFontSize,
      color: '#FFB6C1', // Light pink
      stroke: '#8B0000', // Dark red stroke
      strokeThickness: IS_MOBILE ? 3 : 4,
      align: 'center',
      shadow: {
        offsetX: IS_MOBILE ? 1 : 2,
        offsetY: IS_MOBILE ? 1 : 2,
        color: '#000000',
        blur: IS_MOBILE ? 2 : 4,
        fill: true
      }
    });
    this.main_menu_text.setOrigin(0.5);

    // Add click/tap to restart
    this.input.once('pointerdown', () => {
      this.audioManager.playSound('menuSelect');
      this.scene.start('Game');
    });

    // Add keyboard support for restart
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.audioManager.playSound('menuSelect');
      this.scene.start('Game');
    });

    // Add keyboard support for main menu
    this.input.keyboard?.once('keydown-M', () => {
      this.audioManager.playSound('menuSelect');
      this.scene.start('MainMenu');
    });
  }
}
