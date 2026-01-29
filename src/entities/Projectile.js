import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'cannonball');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Stats
    this.damage = 10;
    this.speed = 400;
    this.pierceRemaining = 0;
    this.hitEnemies = new Set();

    // Disable by default
    this.setActive(false);
    this.setVisible(false);
  }

  fire(fromX, fromY, toX, toY, damage, pierce, speed) {
    this.setPosition(fromX, fromY);
    this.setActive(true);
    this.setVisible(true);

    this.damage = damage;
    this.pierceRemaining = pierce;
    this.speed = speed;
    this.hitEnemies.clear();

    // Calculate direction
    const angle = Phaser.Math.Angle.Between(fromX, fromY, toX, toY);
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    this.rotation = angle;
  }

  update(time, delta) {
    if (!this.active) return;

    // Deactivate if out of bounds
    const margin = 100;

    if (
      this.x < -margin ||
      this.x > GAME_WIDTH + margin ||
      this.y < -margin ||
      this.y > GAME_HEIGHT + margin
    ) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  onHitEnemy(enemy) {
    // Check if already hit this enemy (for pierce)
    if (this.hitEnemies.has(enemy)) {
      return false;
    }

    this.hitEnemies.add(enemy);

    // Check pierce
    if (this.pierceRemaining > 0) {
      this.pierceRemaining--;
      return true; // Continue flying
    }

    // Deactivate
    this.setActive(false);
    this.setVisible(false);
    return false;
  }
}
