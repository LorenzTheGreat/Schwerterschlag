// Player Charakter mit Kampfmechaniken
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Statistiken
    this.stats = {
      hp: 100,
      maxHp: 100,
      speed: 200,
      attackDamage: 15,
      attackCooldown: 400,
      defendReduction: 0.5 // Schaden-Reduktion bei Verteidigung
    };

    // Status
    this.state = {
      isAttacking: false,
      isDefending: false,
      canAttack: true,
      knockbackVelocity: { x: 0, y: 0 }
    };

    // Kollider Setup
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setDrag(0.99);

    // Visuelle Darstellung
    this.setTint(0x00ff00); // Grüne Spielerfarbe
    this.displayWidth = 32;
    this.displayHeight = 48;
  }

  update(inputManager) {
    const movement = inputManager.getMovementDirection();
    
    // Bewegung
    this.setVelocity(
      movement.x * this.stats.speed,
      movement.y * this.stats.speed
    );

    // Status Updates
    this.state.isAttacking = inputManager.isAttacking();
    this.state.isDefending = inputManager.isDefending();

    // Attack-Animation
    if (this.state.isAttacking && this.state.canAttack) {
      this.performAttack();
    }

    // Knockback-Bewegung
    if (this.state.knockbackVelocity.x !== 0 || this.state.knockbackVelocity.y !== 0) {
      this.setVelocity(
        this.state.knockbackVelocity.x,
        this.state.knockbackVelocity.y
      );
      this.state.knockbackVelocity.x *= 0.9;
      this.state.knockbackVelocity.y *= 0.9;
    }
  }

  performAttack() {
    this.state.canAttack = false;
    this.state.isAttacking = true;

    // Animation
    this.setTint(0xffff00);
    this.scene.time.delayedCall(200, () => {
      this.setTint(0x00ff00);
    });

    // Cooldown
    this.scene.time.delayedCall(this.stats.attackCooldown, () => {
      this.state.canAttack = true;
    });

    // Attacke-Event an Scene
    this.scene.events.emit('player-attack', {
      x: this.x,
      y: this.y,
      damage: this.stats.attackDamage,
      direction: this.getDirection()
    });
  }

  getDirection() {
    // Vereinfachte Richtung basierend auf Velocity
    const angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  takeDamage(amount) {
    const damage = this.state.isDefending ? amount * this.stats.defendReduction : amount;
    this.stats.hp -= damage;
    
    // Visuelles Feedback
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.setTint(0x00ff00);
    });

    return this.stats.hp <= 0;
  }

  applyKnockback(x, y, force = 300) {
    this.state.knockbackVelocity.x = x * force;
    this.state.knockbackVelocity.y = y * force;
  }

  heal(amount) {
    this.stats.hp = Math.min(this.stats.hp + amount, this.stats.maxHp);
  }
}
