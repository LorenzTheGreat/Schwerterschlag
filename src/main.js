import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
    min: {
      width: 320,
      height: 240
    },
    max: {
      width: 1920,
      height: 1440
    }
  },
  scene: [BootScene, GameScene],
  render: {
    pixelArt: true,
    antialias: false
  }
};

const game = new Phaser.Game(config);

// Responsive Resize Handler
window.addEventListener('resize', () => {
  game.scale.refresh();
});
