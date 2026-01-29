import Phaser from 'phaser';

export default class XPGem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'xp-gem');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Value
    this.xpValue = 1;

    // Magnet state
    this.isBeingAttracted = false;

    // Disable by default
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x, y, value) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(0, 0);  // Reset velocity from previous use
    this.xpValue = value;
    this.isBeingAttracted = false;

    // Small pop animation
    this.setScale(0.5);
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  update(time, delta) {
    if (!this.active) return;

    const player = this.scene.player;
    if (!player) return;

    // Check if within magnet range
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    if (distance <= player.xpMagnetRange) {
      this.isBeingAttracted = true;
    }

    // Move toward player if being attracted
    if (this.isBeingAttracted) {
      const speed = 300 + (player.xpMagnetRange - distance) * 2;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

      this.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
    }
  }
}
