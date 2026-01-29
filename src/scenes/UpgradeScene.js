import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

// Upgrade definitions
const UPGRADES = [
  {
    id: 'cannon_damage',
    name: 'Heavy Shot',
    description: '+20% cannon damage',
    apply: (player) => { player.cannonDamage *= 1.2; }
  },
  {
    id: 'cannon_speed',
    name: 'Rapid Fire',
    description: '-15% fire rate cooldown',
    apply: (player) => { player.cannonFireRate *= 0.85; }
  },
  {
    id: 'extra_cannon',
    name: 'Extra Cannon',
    description: '+1 cannon (target extra enemy)',
    apply: (player) => { player.cannonCount += 1; }
  },
  {
    id: 'pierce',
    name: 'Chain Shot',
    description: 'Cannonballs pierce +1 enemy',
    apply: (player) => { player.projectilePierce += 1; }
  },
  {
    id: 'range',
    name: 'Long Range',
    description: '+25% cannon range',
    apply: (player) => { player.cannonRange *= 1.25; }
  },
  {
    id: 'max_health',
    name: 'Hull Upgrade',
    description: '+25 max health',
    apply: (player) => {
      player.maxHealth += 25;
      player.currentHealth += 25;
    }
  },
  {
    id: 'regen',
    name: 'Repair Crew',
    description: '+1 HP every 2 seconds',
    apply: (player) => { player.healthRegen += 1; }
  },
  {
    id: 'move_speed',
    name: 'Full Sails',
    description: '+10% movement speed',
    apply: (player) => { player.moveSpeed *= 1.1; }
  },
  {
    id: 'xp_magnet',
    name: 'Treasure Magnet',
    description: '+50% XP pickup range',
    apply: (player) => { player.xpMagnetRange *= 1.5; }
  },
  {
    id: 'xp_bonus',
    name: 'Plunder',
    description: '+20% XP gain',
    apply: (player) => { player.xpMultiplier *= 1.2; }
  }
];

export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UpgradeScene' });
  }

  create() {
    // Semi-transparent overlay
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);

    // Title
    this.add.text(GAME_WIDTH / 2, 100, 'LEVEL UP!', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 160, 'Choose an upgrade:', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Get 3 random upgrades
    const choices = this.getRandomUpgrades(3);

    // Create upgrade buttons
    choices.forEach((upgrade, index) => {
      this.createUpgradeButton(upgrade, index, choices.length);
    });
  }

  getRandomUpgrades(count) {
    const shuffled = [...UPGRADES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  createUpgradeButton(upgrade, index, total) {
    const buttonWidth = 300;
    const buttonHeight = 150;
    const spacing = 50;
    const totalWidth = (buttonWidth * total) + (spacing * (total - 1));
    const startX = (GAME_WIDTH - totalWidth) / 2 + buttonWidth / 2;
    const x = startX + (index * (buttonWidth + spacing));
    const y = GAME_HEIGHT / 2 + 50;

    // Button background
    const bg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x2a2a4a);
    bg.setStrokeStyle(3, 0x4a4a8a);
    bg.setInteractive({ useHandCursor: true });

    // Upgrade name
    this.add.text(x, y - 40, upgrade.name, {
      fontSize: '24px',
      fontFamily: 'Arial Black',
      color: '#FFD700'
    }).setOrigin(0.5);

    // Upgrade description
    this.add.text(x, y + 10, upgrade.description, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      wordWrap: { width: buttonWidth - 20 },
      align: 'center'
    }).setOrigin(0.5);

    // Hover effects
    bg.on('pointerover', () => {
      bg.setFillStyle(0x3a3a6a);
      bg.setStrokeStyle(3, 0xFFD700);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x2a2a4a);
      bg.setStrokeStyle(3, 0x4a4a8a);
    });

    // Click handler
    bg.on('pointerdown', () => {
      this.selectUpgrade(upgrade);
    });
  }

  selectUpgrade(upgrade) {
    const gameScene = this.scene.get('GameScene');

    // Apply upgrade to player
    upgrade.apply(gameScene.player);

    // Resume game
    gameScene.resumeGame();
    this.scene.stop();
  }
}
