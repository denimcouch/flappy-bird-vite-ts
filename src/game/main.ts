import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { GRAVITY_Y, getGameWidth, getGameHeight } from './constants';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: getGameWidth(),
  height: getGameHeight(),
  parent: 'game-container',
  backgroundColor: '#028af8',
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
    width: getGameWidth(),
    height: getGameHeight(),
    min: {
      width: 320,
      height: 480
    },
    max: {
      width: 1200,
      height: 800
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY_Y }
    }
  },
  input: {
    touch: {
      target: 'game-container',
      capture: true
    }
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver]
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
