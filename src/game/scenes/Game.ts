import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  bird: Phaser.GameObjects.Sprite;

  constructor() {
    super('Game');
  }

  create() {
    // this.camera = this.cameras.main;

    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0);

    this.bird = this.add.sprite(800 / 10, 600 / 2, 'bird');
    this.bird.setOrigin(0);

    // console.log('DEBUG', this);

    // this.msg_text = this.add.text(
    //   400,
    //   300,
    //   'Make something fun!\nand share it with us:\nsupport@phaser.io',
    //   {
    //     fontFamily: 'Arial Black',
    //     fontSize: 38,
    //     color: '#ffffff',
    //     stroke: '#000000',
    //     strokeThickness: 8,
    //     align: 'center'
    //   }
    // );
    // this.msg_text.setOrigin(0.5);

    // this.input.once('pointerdown', () => {
    //   this.scene.start('GameOver');
    // });
  }
}
