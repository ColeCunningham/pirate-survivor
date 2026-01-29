import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Background
    this.add.tileSprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      'ocean-tile'
    );

    // Title
    this.add.text(GAME_WIDTH / 2, 150, 'PIRATE SURVIVOR', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 230, 'Survive the Seven Seas!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Ship preview
    const ship = this.add.image(GAME_WIDTH / 2, 350, 'player-ship');
    ship.setScale(2);

    // Start button
    const startButton = this.add.text(GAME_WIDTH / 2, 500, '[ START GAME ]', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#4a4a6a',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#FFD700' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#ffffff' });
    });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Controls info
    this.add.text(GAME_WIDTH / 2, 620, 'Controls: WASD or Arrow Keys to move', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 650, 'Cannons fire automatically!', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    // Animate ship bobbing
    this.tweens.add({
      targets: ship,
      y: 360,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
