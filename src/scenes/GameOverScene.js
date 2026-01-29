import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalTime = data.time || 0;
    this.finalKills = data.kills || 0;
    this.finalLevel = data.level || 1;
  }

  create() {
    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

    // Title
    this.add.text(GAME_WIDTH / 2, 120, 'GAME OVER', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Stats container
    const statsY = 280;

    // Time survived
    const totalSeconds = Math.floor(this.finalTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    this.add.text(GAME_WIDTH / 2, statsY, 'Time Survived', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, statsY + 40, timeString, {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#FFD700'
    }).setOrigin(0.5);

    // Enemies defeated
    this.add.text(GAME_WIDTH / 2, statsY + 120, 'Enemies Defeated', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, statsY + 160, this.finalKills.toString(), {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#FFD700'
    }).setOrigin(0.5);

    // Level reached
    this.add.text(GAME_WIDTH / 2, statsY + 240, 'Level Reached', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, statsY + 280, this.finalLevel.toString(), {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#FFD700'
    }).setOrigin(0.5);

    // Restart button
    const restartButton = this.add.text(GAME_WIDTH / 2, 620, '[ PLAY AGAIN ]', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#4a4a6a',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5);

    restartButton.setInteractive({ useHandCursor: true });

    restartButton.on('pointerover', () => {
      restartButton.setStyle({ color: '#FFD700' });
    });

    restartButton.on('pointerout', () => {
      restartButton.setStyle({ color: '#ffffff' });
    });

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Menu button
    const menuButton = this.add.text(GAME_WIDTH / 2, 680, '[ MAIN MENU ]', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerover', () => {
      menuButton.setStyle({ color: '#ffffff' });
    });

    menuButton.on('pointerout', () => {
      menuButton.setStyle({ color: '#aaaaaa' });
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
