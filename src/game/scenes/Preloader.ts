import { Scene } from 'phaser';

export class Preloader extends Scene {
  private progressBar!: Phaser.GameObjects.Rectangle;
  private progressText!: Phaser.GameObjects.Text;

  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(400, 300, 'background');

    // Create improved loading UI
    this.createLoadingUI();
  }

  private createLoadingUI() {
    // Loading title
    this.add
      .text(400, 200, 'Loading Flappy Bird...', {
        fontSize: '32px',
        fontFamily: 'Arial Black',
        color: '#FFD700',
        stroke: '#FF4500',
        strokeThickness: 4
      })
      .setOrigin(0.5);

    // Progress bar background
    this.add
      .rectangle(400, 300, 400, 30, 0x333333, 0.8)
      .setStrokeStyle(2, 0xffffff)
      .setOrigin(0.5);

    // Progress bar (anchor left edge)
    this.progressBar = this.add
      .rectangle(200, 300, 0, 26, 0x00ff00)
      .setOrigin(0, 0.5);

    // Progress text
    this.progressText = this.add
      .text(400, 350, '0%', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#FFFFFF'
      })
      .setOrigin(0.5);
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets');

    // Core game assets
    this.load.image('bird', 'bird.png');
    this.load.image('birdSprite', 'birdSprite.png');
    this.load.image('pipe', 'pipe.png');
    this.load.image('background', 'bg.png');

    // UI assets
    this.load.image('platform', 'platform.png');
    this.load.image('star', 'star.png');
    this.load.image('pause', 'pause.png');
    this.load.image('back', 'back.png');

    // Set up progress tracking
    this.load.on('progress', (progress: number) => {
      this.updateProgress(progress);
    });

    this.load.on('complete', () => {
      this.progressText.setText('100%');
    });

    // Generate audio files using Web Audio API
    this.generateAudioFiles();
  }

  private updateProgress(progress: number) {
    // Update progress bar width only (left edge stays fixed)
    const barWidth = 396 * progress; // 400 - 4 for padding
    this.progressBar.width = barWidth;
    // No need to update x position since origin is (0, 0.5)

    // Update progress text
    const percentage = Math.round(progress * 100);
    this.progressText.setText(`${percentage}%`);
  }

  generateAudioFiles() {
    // Generate simple audio files using Web Audio API
    this.generateSound('flap', 200, 'sine', 0.3);
    this.generateSound('score', 800, 'square', 0.2);
    this.generateSound('collision', 150, 'sawtooth', 0.4);
    this.generateSound('gameOver', 300, 'triangle', 0.5);
  }

  generateSound(
    key: string,
    frequency: number,
    type: OscillatorType,
    volume: number
  ) {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    // Store the audio context and nodes for later use
    if (!this.cache.audio.has(key)) {
      this.cache.audio.add(key, {
        context: audioContext,
        oscillator: oscillator,
        gainNode: gainNode,
        frequency: frequency,
        type: type,
        volume: volume
      });
    }
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    // Add a small delay for better UX
    this.time.delayedCall(500, () => {
      this.scene.start('MainMenu');
    });
  }
}
