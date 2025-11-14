// UI-Manager für HUD
export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.wave = 1;
    this.enemiesDefeated = 0;

    this.setupUI();
    this.setupEvents();
  }

  setupUI() {
    // Hintergrund für HUD
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(0, 0, this.scene.scale.width, 80);
    graphics.generateTexture('hudBg', this.scene.scale.width, 80);
    graphics.destroy();

    this.hudBg = this.scene.add.image(0, 0, 'hudBg');
    this.hudBg.setOrigin(0, 0);
    this.hudBg.setScrollFactor(0);
    this.hudBg.setDepth(100);

    // Texte
    this.scoreText = this.scene.add.text(20, 15, 'Score: 0', {
      fontSize: '20px',
      fill: '#00ff00',
      fontFamily: 'Arial'
    });
    this.scoreText.setScrollFactor(0).setDepth(101);

    this.waveText = this.scene.add.text(20, 45, 'Wave: 1', {
      fontSize: '20px',
      fill: '#00ff00',
      fontFamily: 'Arial'
    });
    this.waveText.setScrollFactor(0).setDepth(101);

    this.hpText = this.scene.add.text(
      this.scene.scale.width - 20,
      15,
      'HP: 100/100',
      {
        fontSize: '20px',
        fill: '#00ff00',
        fontFamily: 'Arial',
        align: 'right'
      }
    );
    this.hpText.setOrigin(1, 0).setScrollFactor(0).setDepth(101);

    this.enemyCountText = this.scene.add.text(
      this.scene.scale.width - 20,
      45,
      'Enemies: 0',
      {
        fontSize: '20px',
        fill: '#00ff00',
        fontFamily: 'Arial',
        align: 'right'
      }
    );
    this.enemyCountText.setOrigin(1, 0).setScrollFactor(0).setDepth(101);
  }

  setupEvents() {
    this.scene.events.on('enemy-defeated', (data) => {
      this.score += 100;
      this.enemiesDefeated += 1;
      this.update();
    });

    this.scene.events.on('player-defeated', () => {
      this.showGameOver();
    });
  }

  update(player = null, enemyCount = 0) {
    this.scoreText.setText(`Score: ${this.score}`);
    this.waveText.setText(`Wave: ${this.wave}`);
    this.enemyCountText.setText(`Enemies: ${enemyCount}`);

    if (player) {
      this.hpText.setText(`HP: ${Math.max(0, player.stats.hp)}/${player.stats.maxHp}`);
    }
  }

  showGameOver() {
    const gameOverText = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      `GAME OVER\nScore: ${this.score}\nEnemies Defeated: ${this.enemiesDefeated}`,
      {
        fontSize: '48px',
        fill: '#ff0000',
        fontFamily: 'Arial',
        align: 'center'
      }
    );
    gameOverText.setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(200);

    const restartText = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 + 150,
      'Press SPACE to restart',
      {
        fontSize: '24px',
        fill: '#ffff00',
        fontFamily: 'Arial',
        align: 'center'
      }
    );
    restartText.setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(200);

    this.scene.isGameOver = true;
  }

  nextWave() {
    this.wave += 1;
  }
}
