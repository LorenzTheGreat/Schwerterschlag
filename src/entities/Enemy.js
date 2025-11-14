// Gegner mit AI-Logik
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'basic') {
    super(scene, x, y, 'enemy');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.stats = this.getStatsForType(type);
    this.state = {
      isAttacking: false,
      canAttack: true,
      target: null,
      knockbackVelocity: { x: 0, y: 0 }
    };

    // Gegner Setup
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setTint(0xff0000); // Rote Gegnerfarbe
    this.displayWidth = 32;
    this.displayHeight = 48;

    // Verhalten-Timer
    this.aiTimer = 0;
    this.aiDecisionInterval = Phaser.Math.Between(1000, 2000);
  }

  getStatsForType(type) {
    const stats = {
      basic: {
        hp: 30,
        maxHp: 30,
        speed: 120,
        attackDamage: 10,
        attackCooldown: 800,
        attackRange: 50,
        detectionRange: 300
      },
      strong: {
        hp: 60,
        maxHp: 60,
        speed: 100,
        attackDamage: 20,
        attackCooldown: 1000,
        attackRange: 60,
        detectionRange: 400
      }
    };
    return stats[type] || stats.basic;
  }

  update(player, otherEnemies) {
    this.aiTimer += 16;
    this.state.target = player;

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    // KI-Logik
    if (distance < this.stats.detectionRange) {
      this.pursueTarget(player);

      if (distance < this.stats.attackRange && this.state.canAttack) {
        this.performAttack(player);
      }
    } else {
      // Patrouille
      if (this.aiTimer > this.aiDecisionInterval) {
        this.setVelocity(
          Phaser.Math.Between(-100, 100),
          Phaser.Math.Between(-100, 100)
        );
        this.aiTimer = 0;
        this.aiDecisionInterval = Phaser.Math.Between(1000, 2000);
      }
    }

    // Knockback
    if (this.state.knockbackVelocity.x !== 0 || this.state.knockbackVelocity.y !== 0) {
      this.setVelocity(
        this.state.knockbackVelocity.x,
        this.state.knockbackVelocity.y
      );
      this.state.knockbackVelocity.x *= 0.9;
      this.state.knockbackVelocity.y *= 0.9;
    }

    // Kollision mit anderen Gegnern vermeiden
    this.avoidOtherEnemies(otherEnemies);
  }

  pursueTarget(target) {
    const angle = Math.atan2(
      target.y - this.y,
      target.x - this.x
    );
    this.setVelocity(
      Math.cos(angle) * this.stats.speed,
      Math.sin(angle) * this.stats.speed
    );
  }

  performAttack(target) {
    this.state.canAttack = false;
    this.state.isAttacking = true;

    // Animation
    this.setTint(0xffaa00);
    this.scene.time.delayedCall(200, () => {
      this.setTint(0xff0000);
    });

    // Attacke-Event
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.scene.events.emit('enemy-attack', {
      x: this.x,
      y: this.y,
      damage: this.stats.attackDamage,
      direction: { x: Math.cos(angle), y: Math.sin(angle) },
      source: this
    });

    // Cooldown
    this.scene.time.delayedCall(this.stats.attackCooldown, () => {
      this.state.canAttack = true;
    });
  }

  avoidOtherEnemies(others) {
    const avoidDistance = 40;
    let avoidX = 0, avoidY = 0;

    others.forEach(other => {
      if (other === this) return;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
      if (dist < avoidDistance) {
        const angle = Math.atan2(this.y - other.y, this.x - other.x);
        avoidX += Math.cos(angle);
        avoidY += Math.sin(angle);
      }
    });

    if (avoidX !== 0 || avoidY !== 0) {
      const length = Math.sqrt(avoidX * avoidX + avoidY * avoidY);
      this.body.velocity.x += (avoidX / length) * 50;
      this.body.velocity.y += (avoidY / length) * 50;
    }
  }

  takeDamage(amount) {
    this.stats.hp -= amount;
    
    this.setTint(0xffff00);
    this.scene.time.delayedCall(100, () => {
      this.setTint(0xff0000);
    });

    return this.stats.hp <= 0;
  }

  applyKnockback(x, y, force = 300) {
    this.state.knockbackVelocity.x = x * force;
    this.state.knockbackVelocity.y = y * force;
  }
}
