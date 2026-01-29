import Phaser from 'phaser';
import { ENEMIES, ENEMY_TYPES, GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';
import Enemy from '../entities/Enemy.js';

export default class WaveSystem {
  constructor(scene) {
    this.scene = scene;
    this.spawnTimer = 0;
    this.difficulty = 1;
  }

  init() {
    // Create enemy pool
    this.enemyPool = this.scene.physics.add.group({
      classType: Enemy,
      maxSize: 100,
      runChildUpdate: true
    });

    // Store reference in scene for collision detection
    this.scene.enemies = this.enemyPool;
  }

  update(time, delta) {
    // Update difficulty based on game time (increase every 30 seconds)
    this.difficulty = 1 + Math.floor(this.scene.gameTime / 30000);

    // Spawn timer
    this.spawnTimer += delta;

    // Calculate current spawn rate (faster as difficulty increases)
    const currentSpawnRate = Math.max(
      ENEMIES.MIN_SPAWN_RATE,
      ENEMIES.BASE_SPAWN_RATE - (this.difficulty * 150)
    );

    if (this.spawnTimer >= currentSpawnRate) {
      this.spawnWave();
      this.spawnTimer = 0;
    }
  }

  spawnWave() {
    // Number of enemies scales with difficulty
    const enemyCount = Math.min(1 + Math.floor(this.difficulty / 2), 8);

    for (let i = 0; i < enemyCount; i++) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    const player = this.scene.player;
    if (!player) return;

    // Random angle around player
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

    // Spawn at edge of screen + buffer
    const spawnDistance = ENEMIES.SPAWN_DISTANCE;
    const x = player.x + Math.cos(angle) * spawnDistance;
    const y = player.y + Math.sin(angle) * spawnDistance;

    // Clamp to reasonable bounds
    const clampedX = Phaser.Math.Clamp(x, -100, GAME_WIDTH + 100);
    const clampedY = Phaser.Math.Clamp(y, -100, GAME_HEIGHT + 100);

    // Select enemy type based on difficulty
    const enemyType = this.selectEnemyType();

    // Get enemy from pool or create new
    let enemy = this.enemyPool.getFirstDead(false);

    if (enemy) {
      enemy.setTexture(enemyType.key);
      enemy.reset(clampedX, clampedY, enemyType);
    } else {
      enemy = new Enemy(this.scene, clampedX, clampedY, enemyType.key, enemyType);
      this.enemyPool.add(enemy);
    }
  }

  selectEnemyType() {
    const types = Object.values(ENEMY_TYPES);

    // Weight selection based on difficulty
    if (this.difficulty < 2) {
      // Only small ships early
      return ENEMY_TYPES.SMALL_SHIP;
    } else if (this.difficulty < 4) {
      // Small ships and sea monsters
      const roll = Math.random();
      if (roll < 0.7) return ENEMY_TYPES.SMALL_SHIP;
      return ENEMY_TYPES.SEA_MONSTER;
    } else {
      // All types
      const roll = Math.random();
      if (roll < 0.5) return ENEMY_TYPES.SMALL_SHIP;
      if (roll < 0.8) return ENEMY_TYPES.SEA_MONSTER;
      return ENEMY_TYPES.LARGE_SHIP;
    }
  }
}
