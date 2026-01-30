import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';
import Player from '../entities/Player.js';
import XPGem from '../entities/XPGem.js';
import CombatSystem from '../systems/CombatSystem.js';
import WaveSystem from '../systems/WaveSystem.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create scrolling ocean background
    this.ocean = this.add.tileSprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      'ocean-tile'
    );

    // Create player
    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT / 2);

    // Create XP gem group
    this.xpGems = this.physics.add.group({
      classType: XPGem,
      maxSize: 200,
      runChildUpdate: true
    });

    // Pre-populate XP gem pool
    for (let i = 0; i < 30; i++) {
      const gem = new XPGem(this, 0, 0);
      this.xpGems.add(gem);
    }

    // Queue to track gem spawn order (FIFO)
    this.activeGemQueue = [];

    // Game state
    this.gameTime = 0;
    this.kills = 0;
    this.isPaused = false;

    // Initialize systems
    this.waveSystem = new WaveSystem(this);
    this.waveSystem.init();

    this.combatSystem = new CombatSystem(this);
    this.combatSystem.init();

    // Setup input
    this.setupInput();

    // Setup collisions
    this.setupCollisions();

    // Start UI scene in parallel
    this.scene.launch('UIScene');
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Pause on Escape
    this.input.keyboard.on('keydown-ESC', () => {
      this.togglePause();
    });
  }

  setupCollisions() {
    // Player vs Enemy
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.onPlayerHitEnemy,
      null,
      this
    );

    // Player vs XP Gems
    this.physics.add.overlap(
      this.player,
      this.xpGems,
      this.onPlayerCollectXP,
      null,
      this
    );
  }

  update(time, delta) {
    if (this.isPaused) return;

    this.gameTime += delta;

    // Update player
    this.player.update(this.cursors, this.wasd, delta);

    // Update ocean scroll based on player movement
    this.ocean.tilePositionX += this.player.body.velocity.x * delta * 0.001;
    this.ocean.tilePositionY += this.player.body.velocity.y * delta * 0.001;

    // Update systems
    this.waveSystem.update(time, delta);
    this.combatSystem.update(time, delta);

    // Emit UI update event
    this.events.emit('updateUI', {
      health: this.player.currentHealth,
      maxHealth: this.player.maxHealth,
      xp: this.player.xp,
      xpToLevel: this.player.xpToNextLevel,
      level: this.player.level,
      time: this.gameTime,
      kills: this.kills
    });
  }

  onPlayerHitEnemy(player, enemy) {
    if (!enemy.active) return;

    const isDead = player.takeDamage(enemy.damage);
    if (isDead) {
      this.gameOver();
    }
  }

  onPlayerCollectXP(player, gem) {
    if (!gem.active) return;

    // Remove from spawn order queue
    const index = this.activeGemQueue.indexOf(gem);
    if (index > -1) this.activeGemQueue.splice(index, 1);

    // Kill any active tweens on this gem
    this.tweens.killTweensOf(gem);

    // Fully deactivate
    gem.setActive(false);
    gem.setVisible(false);
    gem.setVelocity(0, 0);

    // Disable physics body
    if (gem.body) {
      gem.body.enable = false;
    }

    const leveledUp = player.addXP(gem.xpValue || 1);
    if (leveledUp) {
      this.onLevelUp();
    }
  }

  onEnemyDeath(enemy) {
    // Spawn XP gem at enemy position
    let gem = this.xpGems.getFirstDead(false);

    if (!gem) {
      if (this.xpGems.getLength() >= this.xpGems.maxSize) {
        // Pool full - recycle oldest gem (FIFO)
        gem = this.activeGemQueue.shift();
        if (gem) {
          this.tweens.killTweensOf(gem);
          gem.setVelocity(0, 0);
          if (gem.body) gem.body.enable = false;
        }
      }

      if (!gem) {
        gem = new XPGem(this, 0, 0);
        this.xpGems.add(gem);
      }
    }

    gem.spawn(enemy.x, enemy.y, enemy.xpValue || 1);
    this.activeGemQueue.push(gem);

    // Deactivate enemy
    enemy.setActive(false);
    enemy.setVisible(false);

    this.kills++;
  }

  onLevelUp() {
    this.player.levelUp();

    // Pause game and show upgrade choices
    this.isPaused = true;
    this.physics.pause();
    this.scene.launch('UpgradeScene');
  }

  resumeGame() {
    this.isPaused = false;
    this.physics.resume();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }
  }

  gameOver() {
    this.scene.stop('UIScene');
    this.scene.start('GameOverScene', {
      time: this.gameTime,
      kills: this.kills,
      level: this.player.level
    });
  }
}
