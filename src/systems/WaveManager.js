// Wellen-Manager für Gegner
export class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.currentWave = 1;
    this.enemiesSpawned = 0;
    this.waveActive = false;
  }

  startWave(player) {
    this.waveActive = true;
    const enemyCount = 2 + this.currentWave;
    const positions = this.generateSpawnPositions(player, enemyCount);

    positions.forEach((pos, index) => {
      this.scene.time.delayedCall(index * 300, () => {
        this.scene.events.emit('spawn-enemy', {
          x: pos.x,
          y: pos.y,
          type: this.currentWave > 3 ? 'strong' : 'basic'
        });
        this.enemiesSpawned += 1;
      });
    });
  }

  generateSpawnPositions(player, count) {
    const positions = [];
    const radius = 400;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({
        x: player.x + Math.cos(angle) * radius,
        y: player.y + Math.sin(angle) * radius
      });
    }

    return positions;
  }

  nextWave() {
    this.currentWave += 1;
    this.enemiesSpawned = 0;
    this.waveActive = false;
  }

  isWaveComplete(enemyCount) {
    return this.waveActive && enemyCount === 0 && this.enemiesSpawned > 0;
  }
}
