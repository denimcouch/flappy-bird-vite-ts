import { Scene } from 'phaser';
import {
  FLAP_VELOCITY,
  MAX_VELOCITY,
  ROTATION_SPEED,
  PIPE_SPEED,
  INITIAL_PIPE_SPAWN_INTERVAL,
  PIPE_GAP,
  PIPE_WIDTH,
  SPEED_INCREASE_INTERVAL,
  SPEED_INCREASE_FACTOR,
  IS_MOBILE,
  IS_TOUCH_DEVICE,
  MOBILE_FONT_SCALE,
  MOBILE_PIPE_GAP,
  MOBILE_PIPE_SPEED,
  TOUCH_DEAD_ZONE,
  TOUCH_COOLDOWN
} from '../constants';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  bird: Phaser.Physics.Arcade.Sprite;
  isGameStarted: boolean;
  gameTime: number;
  isPaused: boolean;

  // Pipe system
  pipes: Phaser.GameObjects.Group;
  pipeSpawnTimer: number;
  pipeSpawnTime: number;
  currentPipeSpeed: number;

  // Scoring system
  score: number;
  highScore: number;
  scoreText: Phaser.GameObjects.Text;
  scoredPipes: Set<Phaser.GameObjects.Image>;

  // Pause system
  pauseButton: Phaser.GameObjects.Image;
  pauseOverlay: Phaser.GameObjects.Rectangle;
  pauseGradient: Phaser.GameObjects.Rectangle;
  pauseText: Phaser.GameObjects.Text;
  resumeText: Phaser.GameObjects.Text;

  // Mobile input handling
  lastTouchTime: number;
  touchStartY: number;
  isTouchActive: boolean;

  constructor() {
    super('Game');
  }

  flap() {
    if (!this.bird.body || this.isPaused) return;

    // Set upward velocity
    this.bird.setVelocityY(FLAP_VELOCITY);

    // Limit maximum velocity
    if (this.bird.body.velocity.y < -MAX_VELOCITY) {
      this.bird.setVelocityY(-MAX_VELOCITY);
    }
  }

  // Mobile-specific flap with touch handling
  handleTouchInput(pointer: Phaser.Input.Pointer) {
    const currentTime = Date.now();

    // Prevent rapid tapping
    if (currentTime - this.lastTouchTime < TOUCH_COOLDOWN) {
      return;
    }

    // Handle touch start
    if (pointer.isDown) {
      this.touchStartY = pointer.y;
      this.isTouchActive = true;
    }

    // Handle touch end (flap)
    if (!pointer.isDown && this.isTouchActive) {
      const touchDistance = Math.abs(pointer.y - this.touchStartY);

      // Only flap if touch distance is within dead zone (prevents accidental flaps)
      if (touchDistance < TOUCH_DEAD_ZONE) {
        this.flap();
        this.lastTouchTime = currentTime;
      }

      this.isTouchActive = false;
    }
  }

  togglePause() {
    if (!this.isGameStarted) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.pauseGame();
    } else {
      this.resumeGame();
    }
  }

  pauseGame() {
    // Pause physics
    this.physics.pause();

    // Show pause overlay and gradient
    this.pauseOverlay.setVisible(true);
    this.pauseGradient.setVisible(true);
    this.pauseText.setVisible(true);
    this.resumeText.setVisible(true);

    // Pause bird rotation
    this.bird.setRotation(this.bird.rotation);
  }

  resumeGame() {
    // Resume physics
    this.physics.resume();

    // Hide pause overlay and gradient
    this.pauseOverlay.setVisible(false);
    this.pauseGradient.setVisible(false);
    this.pauseText.setVisible(false);
    this.resumeText.setVisible(false);
  }

  spawnPipes() {
    const gameWidth = this.sys.canvas.width;
    const gameHeight = this.sys.canvas.height;

    // Use mobile-specific values if on mobile
    const pipeGap = IS_MOBILE ? MOBILE_PIPE_GAP : PIPE_GAP;

    // Random gap position (keep it within reasonable bounds)
    const minGapY = 150;
    const maxGapY = gameHeight - 150;
    const gapY = Phaser.Math.Between(minGapY, maxGapY);

    // Create top pipe as regular image (spawns from top, extends downward)
    const topPipe = this.add.image(gameWidth + PIPE_WIDTH / 2, 0, 'pipe');
    topPipe.setOrigin(0.5, 0); // Anchor to top center
    topPipe.setDisplaySize(PIPE_WIDTH, gapY - pipeGap / 2); // Scale height to reach gap

    // Create bottom pipe as regular image (spawns from bottom, extends upward)
    const bottomPipe = this.add.image(
      gameWidth + PIPE_WIDTH / 2,
      gameHeight,
      'pipe'
    );
    bottomPipe.setOrigin(0.5, 1); // Anchor to bottom center
    bottomPipe.setDisplaySize(PIPE_WIDTH, gameHeight - (gapY + pipeGap / 2)); // Scale height to reach gap

    // Add static physics bodies for collision detection
    this.physics.add.existing(topPipe, true); // true = static body
    this.physics.add.existing(bottomPipe, true); // true = static body

    // Add pipes to group
    this.pipes.add(topPipe);
    this.pipes.add(bottomPipe);
  }

  updateScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    // Add score update animation
    this.tweens.add({
      targets: this.scoreText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 200,
      ease: 'Power2',
      yoyo: true
    });

    // Update high score if current score is higher
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('flappyBirdHighScore', this.highScore.toString());

      // Add special animation for new high score
      this.tweens.add({
        targets: this.scoreText,
        tint: 0xffd700, // Gold tint
        duration: 500,
        ease: 'Power2',
        yoyo: true,
        repeat: 2
      });
    }
  }

  checkPipeScoring() {
    if (!this.isGameStarted || this.isPaused) return;

    this.pipes.getChildren().forEach((pipe: any) => {
      // Only check bottom pipes for scoring (to avoid double counting)
      if (pipe.originY === 1) {
        // Bottom pipe
        // Check if bird has passed the pipe and hasn't been scored yet
        if (
          this.bird.x > pipe.x + PIPE_WIDTH / 2 &&
          !this.scoredPipes.has(pipe)
        ) {
          this.updateScore();
          this.scoredPipes.add(pipe);
        }
      }
    });
  }

  create() {
    // Reset all game state variables
    this.isGameStarted = false;
    this.isPaused = false;
    this.gameTime = 0;
    this.currentPipeSpeed = IS_MOBILE ? MOBILE_PIPE_SPEED : PIPE_SPEED;
    this.camera = this.cameras.main;

    // Initialize mobile input handling
    this.lastTouchTime = 0;
    this.touchStartY = 0;
    this.isTouchActive = false;

    // Initialize scoring system
    this.score = 0;
    this.highScore = parseInt(
      localStorage.getItem('flappyBirdHighScore') || '0'
    );
    this.scoredPipes = new Set();

    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0);

    // Create score display with mobile-responsive styling
    const fontSize = IS_MOBILE
      ? `${Math.floor(36 * MOBILE_FONT_SCALE)}px`
      : '36px';
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: fontSize,
      fontFamily: 'Arial Black',
      color: '#FFD700', // Bright gold
      stroke: '#FF4500', // Orange-red stroke
      strokeThickness: IS_MOBILE ? 4 : 6,
      shadow: {
        offsetX: IS_MOBILE ? 2 : 3,
        offsetY: IS_MOBILE ? 2 : 3,
        color: '#000000',
        blur: IS_MOBILE ? 4 : 6,
        fill: true
      }
    });
    this.scoreText.setScrollFactor(0); // Keep score visible during camera movement
    this.scoreText.setDepth(1);

    // Create pause button with mobile-responsive styling
    const pauseButtonScale = IS_MOBILE ? 1.2 : 1.5;
    const pauseButtonX = IS_MOBILE ? this.sys.canvas.width - 50 : 750;
    const pauseButtonY = IS_MOBILE ? 50 : 50;

    this.pauseButton = this.add.image(pauseButtonX, pauseButtonY, 'pause');
    this.pauseButton.setScale(pauseButtonScale);
    this.pauseButton.setScrollFactor(0);
    this.pauseButton.setDepth(2);
    this.pauseButton.setInteractive();
    this.pauseButton.setTint(0x87ceeb); // Light blue tint
    this.pauseButton.on('pointerdown', this.togglePause, this);
    this.pauseButton.on('pointerover', () => {
      this.pauseButton.setTint(0x00ffff); // Cyan on hover
      this.pauseButton.setScale(pauseButtonScale * 1.1);
    });
    this.pauseButton.on('pointerout', () => {
      this.pauseButton.setTint(0x87ceeb); // Back to light blue
      this.pauseButton.setScale(pauseButtonScale);
    });

    // Create pause overlay with mobile-responsive styling
    const overlayWidth = this.sys.canvas.width;
    const overlayHeight = this.sys.canvas.height;
    const overlayX = overlayWidth / 2;
    const overlayY = overlayHeight / 2;

    this.pauseOverlay = this.add.rectangle(
      overlayX,
      overlayY,
      overlayWidth,
      overlayHeight,
      0x000000,
      0.8
    );
    this.pauseOverlay.setScrollFactor(0);
    this.pauseOverlay.setDepth(3);
    this.pauseOverlay.setVisible(false);

    // Add gradient effect to pause overlay
    this.pauseGradient = this.add.rectangle(
      overlayX,
      overlayY,
      overlayWidth,
      overlayHeight,
      0x4169e1,
      0.3
    );
    this.pauseGradient.setScrollFactor(0);
    this.pauseGradient.setDepth(3);
    this.pauseGradient.setVisible(false);

    // Pause text with mobile-responsive styling
    const pauseFontSize = IS_MOBILE ? 40 : 56;
    this.pauseText = this.add.text(overlayX, overlayY - 50, '⏸️ PAUSED ⏸️', {
      fontFamily: 'Arial Black',
      fontSize: pauseFontSize,
      color: '#FFD700', // Bright gold
      stroke: '#FF4500', // Orange-red stroke
      strokeThickness: IS_MOBILE ? 6 : 10,
      align: 'center',
      shadow: {
        offsetX: IS_MOBILE ? 2 : 4,
        offsetY: IS_MOBILE ? 2 : 4,
        color: '#000000',
        blur: IS_MOBILE ? 4 : 8,
        fill: true
      }
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setScrollFactor(0);
    this.pauseText.setDepth(4);
    this.pauseText.setVisible(false);

    // Resume instruction with mobile-responsive styling
    const resumeFontSize = IS_MOBILE ? 20 : 28;
    const resumeText = IS_MOBILE
      ? '🎮 Tap Pause to Resume 🎮'
      : '🎮 Tap Pause Button to Resume 🎮';
    this.resumeText = this.add.text(overlayX, overlayY + 50, resumeText, {
      fontFamily: 'Arial Black',
      fontSize: resumeFontSize,
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
    this.resumeText.setOrigin(0.5);
    this.resumeText.setScrollFactor(0);
    this.resumeText.setDepth(4);
    this.resumeText.setVisible(false);

    // Create bird with physics
    this.bird = this.physics.add.sprite(
      this.sys.canvas.width / 4,
      this.sys.canvas.height / 2,
      'bird'
    );
    this.bird.setOrigin(0.5);

    // Set initial velocity to 0
    this.bird.setVelocityY(0);

    // Set bird properties
    this.bird.setBounce(0);
    this.bird.setCollideWorldBounds(false);

    // Initialize pipe system
    this.pipes = this.add.group();
    this.pipeSpawnTimer = 0;
    this.pipeSpawnTime = INITIAL_PIPE_SPAWN_INTERVAL;

    // Add input handling - support both mouse/keyboard and touch
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard?.on('keydown-SPACE', this.flap, this);
    this.input.keyboard?.on('keydown-P', this.togglePause, this);

    // Add touch-specific input handling for mobile
    if (IS_TOUCH_DEVICE) {
      this.input.on(
        'pointerdown',
        (pointer: Phaser.Input.Pointer) => {
          this.handleTouchInput(pointer);
        },
        this
      );

      this.input.on(
        'pointerup',
        (pointer: Phaser.Input.Pointer) => {
          this.handleTouchInput(pointer);
        },
        this
      );
    }

    // Start the game on first input
    this.input.once('pointerdown', () => {
      if (!this.isGameStarted) {
        this.isGameStarted = true;
        this.flap();
      }
    });
  }

  update(_time: number, delta: number): void {
    if (!this.bird.body || this.isPaused) return;

    // Rotate bird based on velocity
    const velocity = this.bird.body.velocity.y;
    const targetRotation = velocity > 0 ? Math.PI / 2 : -Math.PI / 6;
    this.bird.rotation = Phaser.Math.Linear(
      this.bird.rotation,
      targetRotation,
      ROTATION_SPEED
    );

    // Update game time and speed progression
    if (this.isGameStarted) {
      this.gameTime += delta;

      // Increase speed every 20 seconds
      const speedIncreaseCount = Math.floor(
        this.gameTime / SPEED_INCREASE_INTERVAL
      );
      this.currentPipeSpeed =
        (IS_MOBILE ? MOBILE_PIPE_SPEED : PIPE_SPEED) *
        Math.pow(SPEED_INCREASE_FACTOR, speedIncreaseCount);

      // Decrease spawn interval (faster spawning)
      this.pipeSpawnTime =
        INITIAL_PIPE_SPAWN_INTERVAL *
        Math.pow(SPEED_INCREASE_FACTOR, speedIncreaseCount);

      // Spawn pipes at regular intervals
      this.pipeSpawnTimer += delta;
      if (this.pipeSpawnTimer >= this.pipeSpawnTime) {
        this.spawnPipes();
        this.pipeSpawnTimer = 0;
      }

      // Move pipes manually (since they're regular images)
      this.pipes.getChildren().forEach((pipe: any) => {
        pipe.x -= (this.currentPipeSpeed * delta) / 1000; // Convert to pixels per frame
      });

      // Check for scoring
      this.checkPipeScoring();
    }

    // Remove pipes that have gone off screen
    this.pipes.getChildren().forEach((pipe: any) => {
      if (pipe.x < -PIPE_WIDTH) {
        pipe.destroy();
        // Remove from scored pipes set when destroyed
        this.scoredPipes.delete(pipe);
      }
    });

    // Check for collision with pipes
    this.pipes.getChildren().forEach((pipe: any) => {
      if (this.checkCollision(this.bird, pipe)) {
        this.scene.start('GameOver', {
          score: this.score,
          highScore: this.highScore
        });
      }
    });

    // Check for game over conditions (falling off screen)
    const gameOver =
      this.bird.body.position.y >= this.sys.canvas.height + 50 ||
      this.bird.body.position.y <= -50;
    if (gameOver) {
      this.scene.start('GameOver', {
        score: this.score,
        highScore: this.highScore
      });
    }
  }

  checkCollision(
    bird: Phaser.Physics.Arcade.Sprite,
    pipe: Phaser.GameObjects.Image
  ): boolean {
    // Use reliable bounds checking
    const birdBounds = bird.getBounds();
    const pipeBounds = pipe.getBounds();

    return Phaser.Geom.Rectangle.Overlaps(birdBounds, pipeBounds);
  }
}
