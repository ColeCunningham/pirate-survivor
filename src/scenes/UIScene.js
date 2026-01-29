import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // Health bar background
    this.add.rectangle(120, 30, 204, 24, 0x333333).setStrokeStyle(2, 0x000000);

    // Health bar fill
    this.healthBarFill = this.add.rectangle(20, 30, 200, 20, 0x00ff00);
    this.healthBarFill.setOrigin(0, 0.5);

    // Health text
    this.healthText = this.add.text(120, 30, 'HP', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // XP bar background
    this.add.rectangle(120, 58, 204, 16, 0x333333).setStrokeStyle(2, 0x000000);

    // XP bar fill
    this.xpBarFill = this.add.rectangle(20, 58, 200, 12, 0xffd700);
    this.xpBarFill.setOrigin(0, 0.5);

    // Level display
    this.levelText = this.add.text(235, 44, 'Lv 1', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial Black'
    });

    // Timer (top center)
    this.timerText = this.add.text(GAME_WIDTH / 2, 20, '00:00', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0);

    // Kill counter (top right)
    this.killText = this.add.text(GAME_WIDTH - 20, 20, 'Kills: 0', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0);

    // Listen for updates from GameScene
    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('updateUI', this.updateUI, this);

    // Clean up listener when scene shuts down
    this.events.on('shutdown', () => {
      gameScene.events.off('updateUI', this.updateUI, this);
    });
  }

  updateUI(data) {
    // Update health bar
    const healthPercent = data.health / data.maxHealth;
    this.healthBarFill.width = 200 * healthPercent;

    // Change color based on health
    if (healthPercent < 0.25) {
      this.healthBarFill.setFillStyle(0xff0000);
    } else if (healthPercent < 0.5) {
      this.healthBarFill.setFillStyle(0xffaa00);
    } else {
      this.healthBarFill.setFillStyle(0x00ff00);
    }

    // Update health text
    this.healthText.setText(`${Math.ceil(data.health)} / ${data.maxHealth}`);

    // Update XP bar
    const xpPercent = Math.min(1, data.xp / data.xpToLevel);
    this.xpBarFill.width = 200 * xpPercent;

    // Update level
    this.levelText.setText(`Lv ${data.level}`);

    // Update timer (MM:SS format)
    const totalSeconds = Math.floor(data.time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this.timerText.setText(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );

    // Update kills
    this.killText.setText(`Kills: ${data.kills}`);
  }
}
