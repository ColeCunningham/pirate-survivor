// Game dimensions
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Player configuration
export const PLAYER = {
  START_HEALTH: 100,
  START_SPEED: 200,
  START_DAMAGE: 10,
  START_FIRE_RATE: 1000,
  START_RANGE: 300,
  START_CANNONS: 1,
  INVINCIBILITY_TIME: 500,
  XP_MAGNET_RANGE: 100
};

// Enemy configuration
export const ENEMIES = {
  SPAWN_DISTANCE: 600,
  BASE_SPAWN_RATE: 2000,
  MIN_SPAWN_RATE: 400
};

// Progression configuration
export const PROGRESSION = {
  BASE_XP_TO_LEVEL: 5,
  XP_SCALE_FACTOR: 1.2
};

// Enemy types definition
export const ENEMY_TYPES = {
  SMALL_SHIP: {
    key: 'enemy-ship-small',
    health: 15,
    speed: 100,
    damage: 5,
    xp: 1,
    scale: 1
  },
  LARGE_SHIP: {
    key: 'enemy-ship-large',
    health: 50,
    speed: 60,
    damage: 15,
    xp: 3,
    scale: 1.5
  },
  SEA_MONSTER: {
    key: 'sea-monster',
    health: 30,
    speed: 120,
    damage: 10,
    xp: 2,
    scale: 1
  }
};
