import Phaser from 'phaser';
import Projectile from '../entities/Projectile.js';

export default class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.lastFireTime = 0;
    this.projectilePool = null;
  }

  init() {
    // Create projectile pool
    this.projectilePool = this.scene.physics.add.group({
      classType: Projectile,
      maxSize: 100,
      runChildUpdate: true
    });

    // Pre-populate pool
    for (let i = 0; i < 20; i++) {
      const proj = new Projectile(this.scene, 0, 0);
      this.projectilePool.add(proj);
    }

    // Setup collision with enemies
    this.scene.physics.add.overlap(
      this.projectilePool,
      this.scene.enemies,
      this.onProjectileHitEnemy,
      null,
      this
    );
  }

  update(time, delta) {
    const player = this.scene.player;
    if (!player) return;

    // Check if we can fire
    if (time > this.lastFireTime + player.cannonFireRate) {
      this.fireAtNearestEnemies();
      this.lastFireTime = time;
    }
  }

  fireAtNearestEnemies() {
    const player = this.scene.player;
    const enemies = this.scene.enemies.getChildren().filter(e => e.active);

    if (enemies.length === 0) return;

    // Sort enemies by distance
    enemies.sort((a, b) => {
      const distA = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
      const distB = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
      return distA - distB;
    });

    // Fire at nearest enemies (up to cannonCount)
    const targets = enemies.slice(0, player.cannonCount);

    targets.forEach(target => {
      const distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);

      if (distance <= player.cannonRange) {
        this.fireProjectile(player.x, player.y, target.x, target.y);
      }
    });
  }

  fireProjectile(fromX, fromY, toX, toY) {
    const player = this.scene.player;

    // Get projectile from pool
    let projectile = this.projectilePool.getFirstDead(false);

    if (!projectile) {
      // Create new if pool exhausted
      projectile = new Projectile(this.scene, 0, 0);
      this.projectilePool.add(projectile);
    }

    projectile.fire(
      fromX,
      fromY,
      toX,
      toY,
      player.cannonDamage,
      player.projectilePierce,
      player.projectileSpeed
    );
  }

  onProjectileHitEnemy(projectile, enemy) {
    if (!projectile.active || !enemy.active) return;

    // Check if already hit this enemy
    if (projectile.hitEnemies.has(enemy)) return;

    // Deal damage
    const isDead = enemy.takeDamage(projectile.damage);

    // Handle projectile (pierce or deactivate)
    projectile.onHitEnemy(enemy);

    // Handle enemy death
    if (isDead) {
      this.scene.onEnemyDeath(enemy);
    }
  }
}
