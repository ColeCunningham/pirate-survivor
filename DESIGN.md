# Pirate Survivor - Game Design Document

A Vampire Survivors-style browser game where you control a pirate ship sailing the ocean, fighting off waves of enemies with auto-firing cannons. Built with Phaser.js 3 and Vite.

## Core Mechanics

- **Player Ship**: WASD/arrow key movement, auto-rotating toward movement direction
- **Auto-Combat**: Cannons automatically target and fire at nearest enemies within range
- **Enemy Waves**: Enemies spawn around the player and move toward them, increasing in difficulty over time
- **Progression**: Collect XP gems from defeated enemies, level up to choose upgrades
- **Survival**: Stay alive as long as possible while enemies get stronger

## Project Structure

```
pirate-survivor/
├── index.html              # Entry point
├── package.json            # npm dependencies (phaser, vite, gh-pages)
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.js             # Phaser game initialization
│   ├── config/
│   │   └── constants.js    # Game configuration values
│   ├── scenes/
│   │   ├── BootScene.js    # Asset preloading (generates placeholder graphics)
│   │   ├── MenuScene.js    # Main menu
│   │   ├── GameScene.js    # Core gameplay
│   │   ├── UIScene.js      # HUD overlay (runs parallel to GameScene)
│   │   ├── UpgradeScene.js # Level-up selection modal
│   │   └── GameOverScene.js# End screen with stats
│   ├── entities/
│   │   ├── Player.js       # Player ship class
│   │   ├── Enemy.js        # Base enemy class
│   │   ├── Projectile.js   # Cannonball class
│   │   └── XPGem.js        # Experience pickup
│   └── systems/
│       ├── CombatSystem.js # Auto-targeting and projectile firing
│       └── WaveSystem.js   # Enemy spawning and difficulty scaling
└── public/
    └── assets/             # For future real sprites/audio
```

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server with hot reload (http://localhost:5173)
npm run build      # Build for production
npm run deploy     # Build and deploy to GitHub Pages
```

## Player Stats (Upgradeable)

| Stat | Default | Description |
|------|---------|-------------|
| Health | 100 | Max HP |
| Move Speed | 200 | Pixels per second |
| Cannon Damage | 10 | Damage per hit |
| Fire Rate | 1000ms | Time between shots |
| Range | 300px | Targeting distance |
| Cannon Count | 1 | Simultaneous targets |
| Pierce | 0 | Enemies penetrated per shot |
| XP Magnet Range | 100px | Auto-collect distance |

## Enemy Types

| Type | Health | Speed | Damage | XP | Unlock |
|------|--------|-------|--------|-----|--------|
| Small Ship | 15 | 100 | 5 | 1 | Start |
| Sea Monster | 30 | 120 | 10 | 2 | 1 min |
| Large Ship | 50 | 60 | 15 | 3 | 2 min |

## Upgrades (10 Total)

### Offensive
- **Heavy Shot**: +20% cannon damage
- **Rapid Fire**: -15% fire rate cooldown
- **Extra Cannon**: +1 simultaneous target
- **Chain Shot**: +1 pierce (cannonballs go through enemies)
- **Long Range**: +25% cannon range

### Defensive
- **Hull Upgrade**: +25 max health (also heals)
- **Repair Crew**: +1 HP regeneration every 2 seconds

### Utility
- **Full Sails**: +10% movement speed
- **Treasure Magnet**: +50% XP pickup range
- **Plunder**: +20% XP gain multiplier

## Progression Balance

- **Base XP to Level**: 5
- **XP Scale Factor**: 1.2x per level
- Level 1→2: 5 XP
- Level 2→3: 6 XP
- Level 3→4: 7 XP
- Level 4→5: 9 XP

## Difficulty Scaling

- Difficulty increases every 30 seconds
- Spawn rate: `max(400ms, 2000ms - difficulty * 150ms)`
- Enemy count per wave: `min(1 + floor(difficulty/2), 8)`
- Enemy types unlock based on elapsed time

## Technical Notes

### Object Pooling
All frequently spawned objects use Phaser groups with pooling:
- Enemies: max 100
- Projectiles: max 100
- XP Gems: max 200 (FIFO recycling - oldest gem despawns when pool is full)

### Physics
- Uses Arcade Physics (simple, performant)
- Physics pauses during upgrade selection
- Collision groups: player↔enemies, projectiles↔enemies, player↔gems

### Rendering
- Ocean: TileSprite (256x256 power-of-2 texture) that scrolls with player movement
- Depth layers: Ocean (0) → Gems (5) → Enemies (default) → Player (10)
- All placeholder graphics generated programmatically in BootScene

## Known Issues / TODO

- [x] ~~XP gems may freeze on screen at high enemy counts~~ (Fixed: FIFO recycling + proper physics cleanup)
- [ ] Add sound effects
- [ ] Add particle effects (explosions, water splashes)
- [ ] Add more enemy variety
- [ ] Add special weapons/abilities beyond cannons

## Debug Commands

Open browser console and use:
```javascript
const g = game.scene.getScene('GameScene');
g.xpGems.clear(true, true);   // Clear all gems
g.enemies.clear(true, true);  // Clear all enemies
g.player.currentHealth = g.player.maxHealth;  // Full heal
g.player.addXP(100);          // Give XP
g.onLevelUp();                // Force level up
```

## Deployment

Hosted on GitHub Pages: https://ColeCunningham.github.io/pirate-survivor/

To update: `npm run deploy`
