import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config = {}) {
    super(scene, x, y, texture);

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Stats from config
    this.maxHealth = config.health || 20;
    this.currentHealth = this.maxHealth;
    this.moveSpeed = config.speed || 80;
    this.damage = config.damage || 10;
    this.xpValue = config.xp || 1;

    // Set scale if provided
    if (config.scale) {
      this.setScale(config.scale);
    }

    // Physics setup
    this.body.setSize(this.width * 0.8, this.height * 0.8);
  }

  update(time, delta) {
    if (!this.active) return;

    // Get player reference
    const player = this.scene.player;
    if (!player) return;

    // Move toward player
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );

    // Rotate to face player
    this.rotation = angle;
  }

  takeDamage(amount) {
    this.currentHealth -= amount;

    // Flash white on hit
    this.setTint(0xffffff);
    this.scene.time.delayedCall(50, () => {
      if (this.active) this.clearTint();
    });

    return this.currentHealth <= 0;
  }

  reset(x, y, config) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    this.maxHealth = config.health || 20;
    this.currentHealth = this.maxHealth;
    this.moveSpeed = config.speed || 80;
    this.damage = config.damage || 10;
    this.xpValue = config.xp || 1;

    if (config.scale) {
      this.setScale(config.scale);
    } else {
      this.setScale(1);
    }

    this.clearTint();
  }
}
