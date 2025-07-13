import { Scene, GameObjects } from 'phaser';
import { AudioManager } from '../AudioManager';
import { IS_MOBILE, MOBILE_FONT_SCALE } from '../constants';

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  tapToStart: GameObjects.Text;
  highScoreText: GameObjects.Text;
  tapToStartTween: Phaser.Tweens.Tween;
  titleGlowTween: Phaser.Tweens.Tween;

  // Audio system
  audioManager: AudioManager;

  constructor() {
    super('MainMenu');
  }

  create() {
    // Initialize audio manager
    this.audioManager = new AudioManager(this);

    // Get responsive dimensions
    const gameWidth = this.sys.canvas.width;
    const gameHeight = this.sys.canvas.height;
    const centerX = gameWidth / 2;
    const centerY = gameHeight / 2;

    // Background with enhanced styling
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0);

    // Add a subtle gradient overlay for depth
    const gradient = this.add.rectangle(
      centerX,
      centerY,
      gameWidth,
      gameHeight,
      0x000000,
      0.2
    );
    gradient.setOrigin(0.5);

    // Game title with mobile-responsive styling
    const titleFontSize = IS_MOBILE ? Math.floor(56 * MOBILE_FONT_SCALE) : 56;
    const titleY = IS_MOBILE ? centerY - 80 : 200;

    this.title = this.add.text(centerX, titleY, "FLAPPIN' BIRD", {
      fontFamily: 'Arial Black',
      fontSize: titleFontSize,
      color: '#FFD700', // Bright gold
      stroke: '#FF4500', // Orange-red stroke
      strokeThickness: IS_MOBILE ? 8 : 12,
      align: 'center',
      shadow: {
        offsetX: IS_MOBILE ? 2 : 4,
        offsetY: IS_MOBILE ? 2 : 4,
        color: '#000000',
        blur: IS_MOBILE ? 4 : 8,
        fill: true
      }
    });
    this.title.setOrigin(0.5);

    // Add glowing animation to title
    this.titleGlowTween = this.tweens.add({
      targets: this.title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  
    // High score display with mobile-responsive styling
    const highScoreFontSize = IS_MOBILE
      ? Math.floor(28 * MOBILE_FONT_SCALE)
      : 28;
    const highScoreY = IS_MOBILE ? titleY + 40 : 300;

    const highScore = parseInt(
      localStorage.getItem('flappyBirdHighScore') || '0'
    );
    this.highScoreText = this.add.text(
      centerX,
      highScoreY,
      `🏆 Best Score: ${highScore} 🏆`,
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
    this.highScoreText.setOrigin(0.5);

    // Tap to start instruction with mobile-responsive styling
    const tapFontSize = IS_MOBILE ? Math.floor(36 * MOBILE_FONT_SCALE) : 36;
    const tapY = IS_MOBILE ? highScoreY + 60 : 400;
    const tapText = IS_MOBILE ? '🎮 TAP TO START 🎮' : '🎮 TAP TO START 🎮';

    this.tapToStart = this.add.text(centerX, tapY, tapText, {
      fontFamily: 'Arial Black',
      fontSize: tapFontSize,
      color: '#FF1493', // Deep pink
      stroke: '#8B0000', // Dark red stroke
      strokeThickness: IS_MOBILE ? 5 : 8,
      align: 'center',
      shadow: {
        offsetX: IS_MOBILE ? 2 : 3,
        offsetY: IS_MOBILE ? 2 : 3,
        color: '#000000',
        blur: IS_MOBILE ? 4 : 8,
        fill: true
      }
    });
    this.tapToStart.setOrigin(0.5);

    // Enhanced animation for "Tap to Start" text
    this.tapToStartTween = this.tweens.add({
      targets: this.tapToStart,
      alpha: 0.4,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });

    // Add decorative elements with enhanced effects (mobile-optimized)
    this.addEnhancedStars();
    this.addFloatingBirds();

    // Start background music
    // this.audioManager.startBackgroundMusic();

    // Input handling - support both touch and mouse/keyboard
    this.input.once('pointerdown', () => {
      this.audioManager.playSound('menuSelect');
      this.scene.start('Game');
    });

    // Keyboard support
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.audioManager.playSound('menuSelect');
      this.scene.start('Game');
    });
  }

  addEnhancedStars() {
    // Add more decorative stars with enhanced effects (mobile-optimized)
    const gameWidth = this.sys.canvas.width;
    const gameHeight = this.sys.canvas.height;
    const starCount = IS_MOBILE ? 6 : 8;

    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(50, gameWidth - 50);
      const y = Phaser.Math.Between(50, gameHeight - 50);
      const star = this.add.image(x, y, 'star');
      const starScale = IS_MOBILE
        ? 0.3 + Math.random() * 0.2
        : 0.4 + Math.random() * 0.3;
      star.setScale(starScale);
      star.setAlpha(0.8);
      star.setTint(Phaser.Math.Between(0xffff00, 0xffd700)); // Yellow to gold tints

      // Enhanced floating animation
      this.tweens.add({
        targets: star,
        y: y - (IS_MOBILE ? 20 : 30),
        rotation: Math.PI * 2,
        duration: 3000 + Math.random() * 2000,
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1
      });

      // Add pulsing effect
      this.tweens.add({
        targets: star,
        scaleX: star.scaleX * (IS_MOBILE ? 1.2 : 1.3),
        scaleY: star.scaleY * (IS_MOBILE ? 1.2 : 1.3),
        duration: 1500 + Math.random() * 1000,
        ease: 'Power2',
        yoyo: true,
        repeat: -1
      });
    }
  }

  addFloatingBirds() {
    // Add floating bird decorations (mobile-optimized)
    const gameWidth = this.sys.canvas.width;
    const gameHeight = this.sys.canvas.height;
    const birdCount = IS_MOBILE ? 2 : 3;

    for (let i = 0; i < birdCount; i++) {
      const x = Phaser.Math.Between(100, gameWidth - 100);
      const y = Phaser.Math.Between(100, gameHeight - 100);
      const bird = this.add.image(x, y, 'bird');
      const birdScale = IS_MOBILE ? 0.4 : 0.6;
      bird.setScale(birdScale);
      bird.setAlpha(0.6);
      bird.setTint(0x87ceeb); // Light blue tint

      // Floating animation
      this.tweens.add({
        targets: bird,
        y: y - (IS_MOBILE ? 20 : 30),
        rotation: Math.PI / 6,
        duration: 4000 + Math.random() * 2000,
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1
      });

      // Add gentle rotation
      this.tweens.add({
        targets: bird,
        rotation: -Math.PI / 6,
        duration: 3000 + Math.random() * 2000,
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1
      });
    }
  }
}
