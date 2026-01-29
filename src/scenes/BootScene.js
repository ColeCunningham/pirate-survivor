import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Show loading text
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Generate all placeholder graphics
    this.createPlaceholderGraphics();
  }

  createPlaceholderGraphics() {
    // Ocean tile (256x256 for power-of-2 efficiency)
    this.createOceanTile();

    // Player ship
    this.createPlayerShip();

    // Enemy ships
    this.createEnemyShipSmall();
    this.createEnemyShipLarge();

    // Sea monster
    this.createSeaMonster();

    // Cannonball
    this.createCannonball();

    // XP gem
    this.createXPGem();
  }

  createOceanTile() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Base ocean color
    graphics.fillStyle(0x1a5276, 1);
    graphics.fillRect(0, 0, 256, 256);

    // Add wave patterns
    graphics.lineStyle(2, 0x2980b9, 0.3);
    for (let y = 0; y < 256; y += 32) {
      graphics.beginPath();
      for (let x = 0; x < 256; x += 4) {
        const waveY = y + Math.sin(x * 0.05) * 8;
        if (x === 0) {
          graphics.moveTo(x, waveY);
        } else {
          graphics.lineTo(x, waveY);
        }
      }
      graphics.strokePath();
    }

    // Add some lighter spots for variation
    graphics.fillStyle(0x2980b9, 0.2);
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      graphics.fillCircle(x, y, 20 + Math.random() * 30);
    }

    graphics.generateTexture('ocean-tile', 256, 256);
    graphics.destroy();
  }

  createPlayerShip() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Ship hull (brown)
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(8, 16, 48, 32);

    // Bow (front triangle)
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillTriangle(56, 32, 64, 24, 64, 40);

    // Deck details
    graphics.fillStyle(0xA0522D, 1);
    graphics.fillRect(16, 20, 32, 24);

    // Mast
    graphics.fillStyle(0x4a3728, 1);
    graphics.fillRect(30, 8, 4, 48);

    // Sail
    graphics.fillStyle(0xF5F5DC, 1);
    graphics.fillTriangle(34, 12, 34, 52, 54, 32);

    // Outline
    graphics.lineStyle(2, 0x2C1810, 1);
    graphics.strokeRect(8, 16, 48, 32);

    graphics.generateTexture('player-ship', 64, 64);
    graphics.destroy();
  }

  createEnemyShipSmall() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Ship hull (dark red)
    graphics.fillStyle(0x8B0000, 1);
    graphics.fillRect(6, 12, 36, 24);

    // Bow
    graphics.fillStyle(0x8B0000, 1);
    graphics.fillTriangle(42, 24, 48, 18, 48, 30);

    // Deck
    graphics.fillStyle(0xA52A2A, 1);
    graphics.fillRect(12, 15, 24, 18);

    // Mast
    graphics.fillStyle(0x2C1810, 1);
    graphics.fillRect(22, 6, 3, 36);

    // Sail (black/pirate)
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillTriangle(25, 9, 25, 39, 40, 24);

    graphics.generateTexture('enemy-ship-small', 48, 48);
    graphics.destroy();
  }

  createEnemyShipLarge() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Ship hull (dark)
    graphics.fillStyle(0x4a0000, 1);
    graphics.fillRect(8, 20, 64, 40);

    // Bow
    graphics.fillStyle(0x4a0000, 1);
    graphics.fillTriangle(72, 40, 80, 28, 80, 52);

    // Deck
    graphics.fillStyle(0x6B0000, 1);
    graphics.fillRect(16, 25, 48, 30);

    // Two masts
    graphics.fillStyle(0x2C1810, 1);
    graphics.fillRect(28, 8, 4, 64);
    graphics.fillRect(52, 12, 4, 56);

    // Sails (black)
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillTriangle(32, 12, 32, 56, 50, 34);
    graphics.fillTriangle(56, 16, 56, 52, 70, 34);

    graphics.generateTexture('enemy-ship-large', 80, 80);
    graphics.destroy();
  }

  createSeaMonster() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Body (green)
    graphics.fillStyle(0x228B22, 1);
    graphics.fillCircle(32, 32, 20);

    // Tentacles/spikes
    graphics.fillStyle(0x006400, 1);
    const spikes = 8;
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const x1 = 32 + Math.cos(angle) * 18;
      const y1 = 32 + Math.sin(angle) * 18;
      const x2 = 32 + Math.cos(angle) * 30;
      const y2 = 32 + Math.sin(angle) * 30;
      graphics.fillTriangle(
        x1 - 4, y1,
        x1 + 4, y1,
        x2, y2
      );
    }

    // Eyes
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(26, 28, 4);
    graphics.fillCircle(38, 28, 4);

    // Pupils
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(27, 28, 2);
    graphics.fillCircle(39, 28, 2);

    graphics.generateTexture('sea-monster', 64, 64);
    graphics.destroy();
  }

  createCannonball() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Black cannonball
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(8, 8, 6);

    // Highlight
    graphics.fillStyle(0x4a4a4a, 1);
    graphics.fillCircle(6, 6, 2);

    graphics.generateTexture('cannonball', 16, 16);
    graphics.destroy();
  }

  createXPGem() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Yellow diamond shape
    graphics.fillStyle(0xFFD700, 1);
    graphics.fillTriangle(8, 0, 0, 8, 8, 16);
    graphics.fillTriangle(8, 0, 16, 8, 8, 16);

    // Inner shine
    graphics.fillStyle(0xFFFF00, 1);
    graphics.fillTriangle(8, 3, 3, 8, 8, 13);
    graphics.fillTriangle(8, 3, 13, 8, 8, 13);

    graphics.generateTexture('xp-gem', 16, 16);
    graphics.destroy();
  }

  create() {
    this.scene.start('MenuScene');
  }
}
