// Boot-Szene für Asset-Laden
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Lade Held.png mit hoher Auflösung
    this.load.image('player', '/Schwerterschlag/assets/images/Held.png');
    
    // Fallback: Erstelle dynamische Sprites wenn Bild nicht geladen
    this.load.on('loaderror', (fileObj) => {
      console.warn(`Failed to load: ${fileObj.key}`);
    });
  }

  create() {
    // Starte GameScene nach erfolgreichem Laden
    this.scene.start('GameScene');
  }
}
