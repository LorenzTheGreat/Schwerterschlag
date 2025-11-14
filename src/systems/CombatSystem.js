// Kampf-System
export class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeAttacks = [];

    this.scene.events.on('player-attack', this.handlePlayerAttack, this);
    this.scene.events.on('enemy-attack', this.handleEnemyAttack, this);
  }

  handlePlayerAttack(data) {
    const attack = {
      x: data.x,
      y: data.y,
      damage: data.damage,
      direction: data.direction,
      radius: 60,
      lifetime: 300,
      age: 0,
      source: 'player'
    };

    this.activeAttacks.push(attack);
    this.visualizeAttack(attack);
  }

  handleEnemyAttack(data) {
    const attack = {
      x: data.x,
      y: data.y,
      damage: data.damage,
      direction: data.direction,
      radius: 50,
      lifetime: 300,
      age: 0,
      source: 'enemy',
      sourceEntity: data.source
    };

    this.activeAttacks.push(attack);
    this.visualizeAttack(attack);
  }

  visualizeAttack(attack) {
    // Visueller Effekt für Attacke
    const circle = this.scene.add.circle(
      attack.x,
      attack.y,
      attack.radius,
      attack.source === 'player' ? 0x00ff00 : 0xff0000,
      0.3
    );

    this.scene.tweens.add({
      targets: circle,
      alpha: 0,
      duration: attack.lifetime,
      onComplete: () => circle.destroy()
    });
  }

  update(player, enemies) {
    this.activeAttacks = this.activeAttacks.filter(attack => {
      attack.age += 16;
      return attack.age < attack.lifetime;
    });

    // Spieler-Attacken gegen Gegner
    const playerAttacks = this.activeAttacks.filter(a => a.source === 'player');
    playerAttacks.forEach(attack => {
      enemies.forEach(enemy => {
        if (this.isHit(attack, enemy)) {
          const isDead = enemy.takeDamage(attack.damage);
          const angle = Math.atan2(enemy.y - attack.y, enemy.x - attack.x);
          enemy.applyKnockback(Math.cos(angle), Math.sin(angle));

          if (isDead) {
            this.scene.events.emit('enemy-defeated', { enemy });
          }
        }
      });
    });

    // Gegner-Attacken gegen Spieler
    const enemyAttacks = this.activeAttacks.filter(a => a.source === 'enemy');
    enemyAttacks.forEach(attack => {
      if (this.isHit(attack, player)) {
        const isDead = player.takeDamage(attack.damage);
        const angle = Math.atan2(player.y - attack.y, player.x - attack.x);
        player.applyKnockback(Math.cos(angle), Math.sin(angle));

        if (isDead) {
          this.scene.events.emit('player-defeated');
        }
      }
    });
  }

  isHit(attack, target) {
    const distance = Phaser.Math.Distance.Between(
      attack.x, attack.y,
      target.x, target.y
    );
    return distance < attack.radius + 16;
  }

  clear() {
    this.activeAttacks = [];
  }
}
