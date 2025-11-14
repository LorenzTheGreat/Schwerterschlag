// Eingabe-Manager für Keyboard und Touch
export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.keys = {};
    this.touchState = {
      active: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    };
    this.setupKeyboard();
    this.setupTouch();
  }

  setupKeyboard() {
    this.keys = this.scene.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D',
      attack: 'SPACE',
      defend: 'SHIFT'
    });
  }

  setupTouch() {
    this.scene.input.on('pointerdown', this.handleTouchStart, this);
    this.scene.input.on('pointermove', this.handleTouchMove, this);
    this.scene.input.on('pointerup', this.handleTouchEnd, this);
  }

  handleTouchStart(pointer) {
    this.touchState.active = true;
    this.touchState.startX = pointer.x;
    this.touchState.startY = pointer.y;
    this.touchState.x = pointer.x;
    this.touchState.y = pointer.y;
  }

  handleTouchMove(pointer) {
    this.touchState.x = pointer.x;
    this.touchState.y = pointer.y;
  }

  handleTouchEnd(pointer) {
    this.touchState.active = false;
  }

  getMovementDirection() {
    let x = 0, y = 0;

    if (this.keys.left.isDown) x -= 1;
    if (this.keys.right.isDown) x += 1;
    if (this.keys.up.isDown) y -= 1;
    if (this.keys.down.isDown) y += 1;

    // Touch-basierte Steuerung
    if (this.touchState.active) {
      const deltaX = this.touchState.x - this.touchState.startX;
      const deltaY = this.touchState.y - this.touchState.startY;
      const threshold = 30;

      if (Math.abs(deltaX) > threshold) x = Math.sign(deltaX);
      if (Math.abs(deltaY) > threshold) y = Math.sign(deltaY);
    }

    // Normalisieren
    const length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  isAttacking() {
    return this.keys.attack.isDown || this.scene.input.activePointer.isDown;
  }

  isDefending() {
    return this.keys.defend.isDown;
  }
}
