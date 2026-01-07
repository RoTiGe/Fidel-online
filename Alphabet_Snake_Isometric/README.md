# 🐍 Snake Isometric Adventure

An educational isometric snake game that combines alphabet learning with terrain-based gameplay mechanics.

## Game Features

### Snake Mechanics
- **Growing Snake**: Represented by a series of cylindrical segments
- **Smooth Movement**: Segments follow the head in a fluid snake-like motion
- **Length Growth**: Collect letters to add new segments to your snake
- **Visual Feedback**: Head is bright green with eyes, body fades to darker green

### Terrain-Based Movement Speeds
The snake moves at different speeds depending on the surface:
- **🟢 Grass Ground**: 2.5 units/frame (Slow)
- **🟤 Overland**: 3.0 units/frame (Normal)
- **⬜ Concrete**: 4.5 units/frame (Fast)
- **🔵 Water**: 1.5 units/frame (Very Slow)

### Climbing System
- **Climb Trees**: Press and hold `C` when near a tree to climb up
- **Climb Walls**: Press and hold `C` when near a wall to climb vertically
- **Height Limit**: Can climb up to 150 units high
- **Strategic Advantage**: Use climbing to reach elevated platforms

### Jump Mechanics
- **Jump Down Only**: Press `Space` to jump down from platforms
- **Cannot Jump Up**: Snake cannot jump onto platforms (must climb or use stairs)
- **Gravity**: Snake falls naturally when walking off edges

## Controls

### Keyboard
- **Arrow Keys / WASD**: Move snake in 4 isometric directions
- **C Key**: Hold to climb when near trees or walls
- **Space**: Jump down from platforms
- **Mouse Wheel**: Zoom in/out

### Mobile
- **Directional Buttons**: Move in 4 directions
- **Climb Button**: Activate climbing mode
- **Jump Button**: Jump down

## Game Elements

### Collectibles
- **Geez Alphabet Letters**: Floating golden coins with Ge'ez letters
- **Voice Pronunciation**: Hear the letter pronounced when collected
- **Score**: Each letter adds 1 point and 1 segment to your snake

### Obstacles
- **🌲 Trees**: Can be climbed, blocks horizontal movement
- **🧱 Walls**: Can be climbed, acts as barriers
- **📦 Platforms**: Various heights, some moving
- **Moving Platforms**: Orange platforms that move horizontally

### Terrain Types
Platforms are color-coded by terrain:
- Green = Grass
- Brown = Overland
- Gray = Concrete
- Blue = Water

## HUD Elements
- **Score**: Top right - shows collected letters
- **Snake Length**: Top right - displays segment count
- **Terrain Indicator**: Bottom left - shows current terrain and speed
- **Climbing Status**: Top center - appears when climbing or near climbable object
- **Zoom Control**: Right side - vertical slider for camera zoom

## Game Worlds
The game includes 3 pre-configured worlds loaded from `worlds.json`:
1. **Forest Valley**: Mixed terrain with many climbing opportunities
2. **Mountain Peaks**: High platforms requiring strategic climbing
3. **Desert Oasis**: Water hazards and sparse climbing points

## Technical Details
- **Isometric Projection**: 2:1 tile ratio (40x20 base)
- **Depth Sorting**: All objects rendered in correct visual order
- **Segment Spacing**: 25 units between snake segments
- **Initial Length**: 5 segments
- **Camera**: Follows snake head with smooth tracking

## Tips for Players
1. **Plan Your Route**: Faster terrain isn't always better - plan around obstacles
2. **Use Climbing**: Climb trees and walls to reach high platforms
3. **Watch Your Length**: Longer snake = more segments to manage
4. **Terrain Awareness**: Check the terrain indicator for current speed
5. **Jump Strategically**: Use jump to quickly descend, but can't jump back up

## File Structure
```
Alphabet_Snake_Isometric/
├── index.html          # Game entry point
├── game.js            # Main game logic with snake mechanics
├── worlds.json        # World configurations with terrain types
└── README.md          # This file
```

## Access
Navigate to: `http://localhost:3000/Alphabet_Snake_Isometric/`

Enjoy learning Ge'ez alphabet while mastering the snake! 🐍📚
