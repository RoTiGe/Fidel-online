# World Builder Improvements

## Overview
Enhanced the isometric world builder with advanced features for better level design workflow.

## New Features

### 1. **JSON-Based Element Types** (`element-types.json`)
- Externalized element configuration for easy scalability
- Organized elements into categories:
  - **Structures**: Platforms, Walls
  - **Decorations**: Trees
  - **Collectibles**: Letters/Coins
  - **Enemies**: Lion, Ape, Horse
- Each element type includes:
  - Icon, name, category
  - Grid snap settings
  - Configurable properties (width, depth, height, movement, etc.)

### 2. **Advanced Zoom & Pan**
- **Mouse Wheel Zoom**: Zoom in/out with mouse wheel (0.3x - 3.0x)
- **Zoom to Cursor**: Zoom centers on mouse position for precise navigation
- **Right-Click Pan**: Drag with right mouse button to pan the view
- **Zoom Display**: Real-time zoom percentage shown in info panel

### 3. **Free Placement Mode**
- **Grid Snap Toggle**: Button to switch between grid-aligned and free placement
- **Element-Specific Snapping**: 
  - Structures (platforms, walls) default to 50px grid snap
  - Decorations and enemies default to 10px fine snap
  - Can override with free placement mode
- Visual indicator shows current placement mode

### 4. **Enemy Support**
- Added three enemy types: Lion 🦁, Ape 🦍, Horse 🐴
- Enemies can be placed anywhere in the world
- Visual representation in the builder
- Exported to world JSON for game integration

### 5. **Dynamic UI**
- Tools are now loaded from `element-types.json`
- Properties panel updates based on selected tool
- Conditional properties (e.g., move speed only shown for moving platforms)
- Organized tool categories with color coding

### 6. **Improved Controls**
- **Left Click**: Place selected element
- **Right Drag**: Pan camera
- **Mouse Wheel**: Zoom in/out
- **Delete Tool**: Click to remove nearby objects
- **Free Place Toggle**: Switch placement modes

## Files Modified

1. **element-types.json** (NEW)
   - Configuration for all placeable elements
   - Easy to extend with new element types

2. **world-builder.js**
   - Added `loadElementTypes()` function
   - Implemented zoom-to-cursor functionality
   - Added free placement mode
   - Enhanced object placement with property system
   - Added enemy rendering and management
   - Updated export/import to include enemies

3. **world-builder.html**
   - Simplified UI with dynamic tool loading
   - Added free placement toggle button
   - Removed hardcoded tool buttons
   - Added tool categories styling
   - Updated info panel with controls help

## Usage

### Adding New Element Types
Edit `element-types.json`:
```json
{
  "id": "newElement",
  "name": "New Element",
  "icon": "🎯",
  "category": "structures",
  "gridSnap": true,
  "snapSize": 50,
  "properties": {
    "size": { "type": "number", "default": 100, "min": 10, "max": 500, "label": "Size" }
  }
}
```

### Controls
- **Zoom**: Mouse wheel (0.3x to 3.0x)
- **Pan**: Right-click and drag
- **Place**: Left-click
- **Free Place**: Toggle button in sidebar
- **Delete**: Select delete tool, then click objects

## Benefits
- ✅ Easier to add new element types without code changes
- ✅ Better navigation with zoom and pan
- ✅ Precise placement with free mode
- ✅ Enemy support for gameplay
- ✅ Cleaner, more maintainable code
- ✅ Better UX with dynamic properties panel

