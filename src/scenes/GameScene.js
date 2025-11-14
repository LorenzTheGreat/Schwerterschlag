// Hauptspielszene
import Phaser from 'phaser';
import { InputManager } from '../systems/InputManager.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { WaveManager } from '../systems/WaveManager.js';
import { UIManager } from '../ui/UIManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Kamera-Setup für responsives Design
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Entities
    this.player = new Player(this, 400, 300);
    this.enemies = [];
    this.isGameOver = false;

    // Systeme
    this.inputManager = new InputManager(this);
    this.combatSystem = new CombatSystem(this);
    this.waveManager = new WaveManager(this);
    this.uiManager = new UIManager(this);

    // Events
    this.setupEvents();

    // Erste Welle starten
    this.time.delayedCall(1000, () => {
      this.waveManager.startWave(this.player);
    });
  }

  setupEvents() {
    this.events.on('spawn-enemy', (data) => {
      const enemy = new Enemy(this, data.x, data.y, data.type);
      this.enemies.push(enemy);
    });

    this.events.on('enemy-defeated', (data) => {
      const index = this.enemies.indexOf(data.enemy);
      if (index > -1) {
        this.enemies.splice(index, 1);
        data.enemy.destroy();
      }

      // Nächste Welle wenn alle Gegner weg
      if (this.waveManager.isWaveComplete(this.enemies.length)) {
        this.waveManager.nextWave();
        this.uiManager.nextWave();
        this.time.delayedCall(2000, () => {
          this.waveManager.startWave(this.player);
        });
      }
    });

    this.events.on('player-defeated', () => {
      this.handleGameOver();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.isGameOver) {
        this.scene.restart();
      }
    });

    // Touch-Restart für Mobile
    this.input.on('pointerdown', () => {
      if (this.isGameOver) {
        this.scene.restart();
      }
    });
  }

  update() {
    if (this.isGameOver) return;

    // Player Update
    this.player.update(this.inputManager);

    // Enemies Update
    this.enemies.forEach(enemy => {
      enemy.update(this.player, this.enemies);
    });

    // Combat Update
    this.combatSystem.update(this.player, this.enemies);

    // Camera Follow
    this.cameras.main.centerOn(this.player.x, this.player.y);

    // UI Update
    this.uiManager.update(this.player, this.enemies.length);
  }

  handleGameOver() {
    this.isGameOver = true;
  }
}
