import Phaser from 'phaser';
import { PLAYER, PROGRESSION, GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-ship');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Base stats
    this.maxHealth = PLAYER.START_HEALTH;
    this.currentHealth = this.maxHealth;
    this.moveSpeed = PLAYER.START_SPEED;

    // Combat stats
    this.cannonDamage = PLAYER.START_DAMAGE;
    this.cannonFireRate = PLAYER.START_FIRE_RATE;
    this.cannonRange = PLAYER.START_RANGE;
    this.cannonCount = PLAYER.START_CANNONS;
    this.projectileSpeed = 400;
    this.projectilePierce = 0;

    // Progression
    this.xp = 0;
    this.level = 1;
    this.xpToNextLevel = PROGRESSION.BASE_XP_TO_LEVEL;
    this.xpMultiplier = 1;
    this.xpMagnetRange = PLAYER.XP_MAGNET_RANGE;

    // Defensive
    this.healthRegen = 0;
    this.regenTimer = 0;

    // State
    this.isInvincible = false;
    this.invincibilityTimer = 0;

    // Physics setup
    this.setCollideWorldBounds(true);
    this.body.setSize(48, 32);
    this.body.setOffset(8, 16);

    // Render above gems and enemies
    this.setDepth(10);
  }

  update(cursors, wasd, delta) {
    // Handle movement input
    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.left.isDown) vx = -1;
    if (cursors.right.isDown || wasd.right.isDown) vx = 1;
    if (cursors.up.isDown || wasd.up.isDown) vy = -1;
    if (cursors.down.isDown || wasd.down.isDown) vy = 1;

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.setVelocity(vx * this.moveSpeed, vy * this.moveSpeed);

    // Rotate toward movement direction
    if (vx !== 0 || vy !== 0) {
      const targetAngle = Math.atan2(vy, vx);
      this.rotation = Phaser.Math.Angle.RotateTo(
        this.rotation,
        targetAngle,
        0.15
      );
    }

    // Handle invincibility
    if (this.isInvincible) {
      this.invincibilityTimer -= delta;
      this.alpha = Math.sin(this.invincibilityTimer * 0.02) * 0.3 + 0.7;

      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
        this.alpha = 1;
      }
    }

    // Health regeneration
    if (this.healthRegen > 0 && this.currentHealth < this.maxHealth) {
      this.regenTimer += delta;
      if (this.regenTimer >= 2000) {
        this.heal(this.healthRegen);
        this.regenTimer = 0;
      }
    }
  }

  takeDamage(amount) {
    if (this.isInvincible) return false;

    this.currentHealth -= amount;
    this.currentHealth = Math.max(0, this.currentHealth);

    // Start invincibility
    this.isInvincible = true;
    this.invincibilityTimer = PLAYER.INVINCIBILITY_TIME;

    // Screen shake
    this.scene.cameras.main.shake(100, 0.01);

    // Flash red
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.clearTint());

    return this.currentHealth <= 0;
  }

  heal(amount) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }

  addXP(amount) {
    this.xp += Math.floor(amount * this.xpMultiplier);
    return this.xp >= this.xpToNextLevel;
  }

  levelUp() {
    this.xp -= this.xpToNextLevel;
    this.level++;
    this.xpToNextLevel = Math.floor(
      PROGRESSION.BASE_XP_TO_LEVEL *
      Math.pow(PROGRESSION.XP_SCALE_FACTOR, this.level - 1)
    );
  }
}
