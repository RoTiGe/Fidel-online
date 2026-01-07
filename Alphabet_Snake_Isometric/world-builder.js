const canvas = document.getElementById('worldCanvas');
const ctx = canvas.getContext('2d');

// Canvas setup
let canvasWidth = window.innerWidth - 300;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth - 300;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    draw();
});

// Isometric constants
const TILE_WIDTH = 40;
const TILE_HEIGHT = 20;

// Camera
let cameraX = 0;
let cameraY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let zoom = 1.0;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3.0;

// Grid
let showGrid = true;

// Current tool and element types
let currentTool = 'platform';
let elementTypes = null;
let currentElementType = null;
let freePlace = false; // Toggle for free placement vs grid snap

// World objects
let worldObjects = [];
let letterPositions = [];
let enemies = [];

// Load element types from JSON
async function loadElementTypes() {
    try {
        const response = await fetch('element-types.json');
        if (!response.ok) throw new Error('Failed to load element types');
        elementTypes = await response.json();
        console.log('✅ Element types loaded:', elementTypes);
        initializeTools();
    } catch (error) {
        console.error('Failed to load element-types.json:', error);
        alert('Failed to load element types configuration');
    }
}

// Initialize tools from element types
function initializeTools() {
    const toolsContainer = document.getElementById('toolsContainer');
    if (!toolsContainer || !elementTypes) return;

    toolsContainer.innerHTML = '';

    // Group by category
    elementTypes.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'tool-category';
        categoryDiv.innerHTML = `<h4 style="color: ${category.color}; margin: 10px 0 5px 0;">${category.name}</h4>`;

        const elements = elementTypes.elementTypes.filter(e => e.category === category.id);
        elements.forEach(element => {
            const button = document.createElement('button');
            button.className = 'tool-button';
            button.dataset.tool = element.id;
            button.innerHTML = `${element.icon} ${element.name}`;
            button.addEventListener('click', () => selectTool(element.id));
            categoryDiv.appendChild(button);
        });

        toolsContainer.appendChild(categoryDiv);
    });

    // Add delete tool
    const deleteButton = document.createElement('button');
    deleteButton.className = 'tool-button';
    deleteButton.dataset.tool = 'delete';
    deleteButton.innerHTML = '🗑️ Delete';
    deleteButton.addEventListener('click', () => selectTool('delete'));
    toolsContainer.appendChild(deleteButton);

    // Select first tool
    selectTool('platform');
}

function selectTool(toolId) {
    currentTool = toolId;
    currentElementType = elementTypes.elementTypes.find(e => e.id === toolId);

    // Update active button
    document.querySelectorAll('.tool-button').forEach(b => b.classList.remove('active'));
    const button = document.querySelector(`[data-tool="${toolId}"]`);
    if (button) button.classList.add('active');

    // Update current tool display
    const toolDisplay = document.getElementById('currentTool');
    if (toolDisplay) {
        toolDisplay.textContent = currentElementType ? currentElementType.name : toolId;
    }

    // Update properties panel
    updatePropertiesPanel();
}

function updatePropertiesPanel() {
    const panel = document.getElementById('propertiesPanel');
    if (!panel) return;

    panel.innerHTML = '';

    if (!currentElementType || !currentElementType.properties) return;

    Object.entries(currentElementType.properties).forEach(([key, prop]) => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const label = document.createElement('label');
        label.textContent = prop.label;
        group.appendChild(label);

        if (prop.type === 'boolean') {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `prop_${key}`;
            input.checked = prop.default;
            group.appendChild(input);
        } else if (prop.type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `prop_${key}`;
            input.value = prop.default;
            if (prop.min !== undefined) input.min = prop.min;
            if (prop.max !== undefined) input.max = prop.max;
            if (prop.step !== undefined) input.step = prop.step;
            group.appendChild(input);
        }

        panel.appendChild(group);
    });
}

// Load element types on startup
loadElementTypes();

// Isometric conversion
function toIso(x, y) {
    return {
        x: (x - y) * (TILE_WIDTH / 2) * zoom,
        y: (x + y) * (TILE_HEIGHT / 2) * zoom
    };
}

function toCart(isoX, isoY) {
    const adjustedX = isoX / zoom;
    const adjustedY = isoY / zoom;
    return {
        x: (adjustedX / (TILE_WIDTH / 2) + adjustedY / (TILE_HEIGHT / 2)) / 2,
        y: (adjustedY / (TILE_HEIGHT / 2) - adjustedX / (TILE_WIDTH / 2)) / 2
    };
}

// Canvas mouse events
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2 || e.ctrlKey) { // Right click or Ctrl+click to pan
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    } else if (e.button === 0) { // Left click to place
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const worldPos = toCart(mouseX - canvasWidth / 2 + cameraX, mouseY - canvasHeight / 2 + cameraY);
        
        placeObject(worldPos.x, worldPos.y);
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const worldPos = toCart(mouseX - canvasWidth / 2 + cameraX, mouseY - canvasHeight / 2 + cameraY);
    document.getElementById('mousePos').textContent = `${Math.round(worldPos.x)}, ${Math.round(worldPos.y)}`;
    
    if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        cameraX -= dx;
        cameraY -= dy;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    // Get mouse position before zoom
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate world position before zoom
    const worldPosBefore = toCart(mouseX - canvasWidth / 2 + cameraX, mouseY - canvasHeight / 2 + cameraY);

    // Apply zoom
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom *= delta;
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

    // Calculate world position after zoom
    const worldPosAfter = toCart(mouseX - canvasWidth / 2 + cameraX, mouseY - canvasHeight / 2 + cameraY);

    // Adjust camera to keep mouse position stable
    const worldDelta = toIso(worldPosAfter.x - worldPosBefore.x, worldPosAfter.y - worldPosBefore.y);
    cameraX += worldDelta.x;
    cameraY += worldDelta.y;

    // Update zoom display
    const zoomEl = document.getElementById('zoomLevel');
    if (zoomEl) zoomEl.textContent = Math.round(zoom * 100) + '%';

    draw();
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Place object
function placeObject(x, y) {
    // Determine snap size based on element type
    let snapSize = 50; // Default grid snap
    let useSnap = true;

    if (currentElementType) {
        useSnap = freePlace ? false : currentElementType.gridSnap;
        snapSize = currentElementType.snapSize || 50;
    }

    const finalX = useSnap ? Math.round(x / snapSize) * snapSize : Math.round(x);
    const finalY = useSnap ? Math.round(y / snapSize) * snapSize : Math.round(y);

    if (currentTool === 'delete') {
        deleteObjectAt(finalX, finalY);
        return;
    }

    // Handle legacy letter placement
    if (currentTool === 'letter') {
        const letterZ = getPropertyValue('z', 50);
        letterPositions.push({ x: finalX, y: finalY, z: letterZ });
        updateObjectList();
        draw();
        return;
    }

    // Handle enemy placement
    if (currentTool === 'lion' || currentTool === 'ape' || currentTool === 'horse') {
        enemies.push({ type: currentTool, x: finalX, y: finalY });
        updateObjectList();
        draw();
        return;
    }

    // Create object with properties from element type
    const obj = {
        type: currentTool,
        x: finalX,
        y: finalY
    };

    // Add properties from element type
    if (currentElementType && currentElementType.properties) {
        Object.entries(currentElementType.properties).forEach(([key, prop]) => {
            obj[key] = getPropertyValue(key, prop.default);
        });
    }

    worldObjects.push(obj);
    updateObjectList();
    draw();
}

// Get property value from input or default
function getPropertyValue(key, defaultValue) {
    const input = document.getElementById(`prop_${key}`);
    if (!input) return defaultValue;

    if (input.type === 'checkbox') {
        return input.checked;
    } else if (input.type === 'number') {
        return parseFloat(input.value) || defaultValue;
    }
    return input.value || defaultValue;
}

function deleteObjectAt(x, y) {
    const deleteRadius = 30;

    worldObjects = worldObjects.filter(obj => {
        const distance = Math.hypot(obj.x - x, obj.y - y);
        return distance > deleteRadius;
    });

    letterPositions = letterPositions.filter(pos => {
        const distance = Math.hypot(pos.x - x, pos.y - y);
        return distance > deleteRadius;
    });

    enemies = enemies.filter(enemy => {
        const distance = Math.hypot(enemy.x - x, enemy.y - y);
        return distance > deleteRadius;
    });

    updateObjectList();
    draw();
}

// Update object list in sidebar
function updateObjectList() {
    const list = document.getElementById('objectList');
    list.innerHTML = '';
    
    worldObjects.forEach((obj, index) => {
        const item = document.createElement('div');
        item.className = 'object-item';
        item.innerHTML = `
            <span>${obj.type} (${obj.x}, ${obj.y})</span>
            <button onclick="deleteObject(${index})">Del</button>
        `;
        list.appendChild(item);
    });
    
    letterPositions.forEach((pos, index) => {
        const item = document.createElement('div');
        item.className = 'object-item';
        const zInfo = pos.z ? ` z:${pos.z}` : '';
        item.innerHTML = `
            <span>💎 Letter (${pos.x}, ${pos.y}${zInfo})</span>
            <button onclick="deleteLetter(${index})">Del</button>
        `;
        list.appendChild(item);
    });

    enemies.forEach((enemy, index) => {
        const item = document.createElement('div');
        item.className = 'object-item';
        const emoji = enemy.type === 'lion' ? '🦁' : enemy.type === 'ape' ? '🦍' : '🐴';
        item.innerHTML = `
            <span>${emoji} ${enemy.type} (${enemy.x}, ${enemy.y})</span>
            <button onclick="deleteEnemy(${index})">Del</button>
        `;
        list.appendChild(item);
    });

    const totalCount = worldObjects.length + letterPositions.length + enemies.length;
    document.getElementById('objectCount').textContent = totalCount;
}

function deleteObject(index) {
    worldObjects.splice(index, 1);
    updateObjectList();
    draw();
}

function deleteLetter(index) {
    letterPositions.splice(index, 1);
    updateObjectList();
    draw();
}

function deleteEnemy(index) {
    enemies.splice(index, 1);
    updateObjectList();
    draw();
}

// Draw functions
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.save();
    ctx.translate(canvasWidth / 2 - cameraX, canvasHeight / 2 - cameraY);
    
    // Draw grid
    if (showGrid) {
        drawGrid();
    }
    
    // Sort objects by depth
    const allObjects = [...worldObjects].sort((a, b) => (a.y + (a.depth || 0)) - (b.y + (b.depth || 0)));
    
    // Draw objects
    allObjects.forEach(obj => {
        if (obj.type === 'platform') {
            drawPlatform(obj);
        } else if (obj.type === 'tree') {
            drawTree(obj);
        } else if (obj.type === 'wall') {
            drawWall(obj);
        }
    });
    
    // Draw letter positions
    letterPositions.forEach(pos => {
        drawLetterMarker(pos);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        drawEnemy(enemy);
    });

    // Draw player start
    drawPlayerStart();

    ctx.restore();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = -2000; x <= 2000; x += 100) {
        for (let y = -2000; y <= 2000; y += 100) {
            const iso = toIso(x, y);
            const iso2 = toIso(x + 100, y);
            const iso3 = toIso(x, y + 100);
            
            ctx.beginPath();
            ctx.moveTo(iso.x, iso.y);
            ctx.lineTo(iso2.x, iso2.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(iso.x, iso.y);
            ctx.lineTo(iso3.x, iso3.y);
            ctx.stroke();
        }
    }
}

function drawPlatform(obj) {
    const iso1 = toIso(obj.x, obj.y);
    const iso2 = toIso(obj.x + obj.width, obj.y);
    const iso3 = toIso(obj.x + obj.width, obj.y + obj.depth);
    const iso4 = toIso(obj.x, obj.y + obj.depth);
    
    const z = -obj.height * zoom;
    
    // Top face
    ctx.fillStyle = obj.moving ? '#FFA726' : (obj.height === 0 ? '#4CAF50' : '#8D6E63');
    ctx.beginPath();
    ctx.moveTo(iso1.x, iso1.y + z);
    ctx.lineTo(iso2.x, iso2.y + z);
    ctx.lineTo(iso3.x, iso3.y + z);
    ctx.lineTo(iso4.x, iso4.y + z);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Right face
    ctx.fillStyle = obj.moving ? '#F57C00' : (obj.height === 0 ? '#388E3C' : '#6D4C41');
    ctx.beginPath();
    ctx.moveTo(iso2.x, iso2.y + z);
    ctx.lineTo(iso3.x, iso3.y + z);
    ctx.lineTo(iso3.x, iso3.y);
    ctx.lineTo(iso2.x, iso2.y);
    ctx.closePath();
    ctx.fill();
    
    // Left face
    ctx.fillStyle = obj.moving ? '#FB8C00' : (obj.height === 0 ? '#43A047' : '#795548');
    ctx.beginPath();
    ctx.moveTo(iso3.x, iso3.y + z);
    ctx.lineTo(iso4.x, iso4.y + z);
    ctx.lineTo(iso4.x, iso4.y);
    ctx.lineTo(iso3.x, iso3.y);
    ctx.closePath();
    ctx.fill();
}

function drawTree(obj) {
    const iso = toIso(obj.x + 25, obj.y + 25);
    
    // Trunk
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(iso.x - 5 * zoom, iso.y - 25 * zoom, 10 * zoom, 25 * zoom);
    
    // Foliage
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath();
    ctx.arc(iso.x, iso.y - 37 * zoom, 17 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawWall(obj) {
    const iso1 = toIso(obj.x, obj.y);
    const iso2 = toIso(obj.x + obj.width, obj.y);
    const iso3 = toIso(obj.x + obj.width, obj.y + obj.depth);
    const iso4 = toIso(obj.x, obj.y + obj.depth);
    
    const height = 50 * zoom;
    
    // Top
    ctx.fillStyle = '#BCAAA4';
    ctx.beginPath();
    ctx.moveTo(iso1.x, iso1.y - height);
    ctx.lineTo(iso2.x, iso2.y - height);
    ctx.lineTo(iso3.x, iso3.y - height);
    ctx.lineTo(iso4.x, iso4.y - height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Right face
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.moveTo(iso2.x, iso2.y - height);
    ctx.lineTo(iso3.x, iso3.y - height);
    ctx.lineTo(iso3.x, iso3.y);
    ctx.lineTo(iso2.x, iso2.y);
    ctx.closePath();
    ctx.fill();
    
    // Left face
    ctx.fillStyle = '#A1887F';
    ctx.beginPath();
    ctx.moveTo(iso3.x, iso3.y - height);
    ctx.lineTo(iso4.x, iso4.y - height);
    ctx.lineTo(iso4.x, iso4.y);
    ctx.lineTo(iso3.x, iso3.y);
    ctx.closePath();
    ctx.fill();
}

function drawEnemy(enemy) {
    const iso = toIso(enemy.x, enemy.y);
    const size = 20 * zoom;

    // Enemy body
    let color = '#D4A574';
    let emoji = '🦁';
    if (enemy.type === 'ape') {
        color = '#8B4513';
        emoji = '🦍';
    } else if (enemy.type === 'horse') {
        color = '#A0522D';
        emoji = '🐴';
    }

    ctx.fillStyle = color;
    ctx.fillRect(iso.x - size/2, iso.y - size, size, size);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(iso.x - size/2, iso.y - size, size, size);

    // Emoji
    ctx.font = `${Math.floor(16 * zoom)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, iso.x, iso.y - size/2);
}

function drawLetterMarker(pos) {
    const iso = toIso(pos.x, pos.y);

    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(iso.x, iso.y - 15 * zoom, 14 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.font = `bold ${16 * zoom}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💎', iso.x, iso.y - 15 * zoom);
}

function drawPlayerStart() {
    const x = parseInt(document.getElementById('playerX').value);
    const y = parseInt(document.getElementById('playerY').value);
    const iso = toIso(x, y);
    
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(iso.x - 15 * zoom, iso.y - 30 * zoom, 30 * zoom, 40 * zoom);
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(iso.x - 15 * zoom, iso.y - 30 * zoom, 30 * zoom, 40 * zoom);
    
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${20 * zoom}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('P', iso.x, iso.y - 10 * zoom);
}

// Export world
function exportWorld() {
    const worldData = {
        worlds: [{
            id: parseInt(document.getElementById('worldId').value),
            name: document.getElementById('worldName').value,
            playerStart: {
                x: parseInt(document.getElementById('playerX').value),
                y: parseInt(document.getElementById('playerY').value)
            },
            objects: [
                {
                    type: 'groundPlatform',
                    x: 0,
                    y: 0,
                    width: 4000,
                    depth: 4000,
                    height: 0
                },
                ...worldObjects
            ],
            letterPositions: letterPositions,
            enemies: enemies
        }]
    };
    
    const json = JSON.stringify(worldData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = document.getElementById('worldName').value.toLowerCase().replace(/\s+/g, '-');
    a.download = `world-${filename}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('World exported! Check your downloads folder.');
}

// Load from file
function loadFromFile() {
    document.getElementById('fileInput').click();
}

function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.worlds && data.worlds.length > 0) {
                const world = data.worlds[0];
                
                document.getElementById('worldId').value = world.id;
                document.getElementById('worldName').value = world.name;
                document.getElementById('playerX').value = world.playerStart.x;
                document.getElementById('playerY').value = world.playerStart.y;
                
                worldObjects = world.objects.filter(obj => obj.type !== 'groundPlatform');
                letterPositions = world.letterPositions || [];
                enemies = world.enemies || [];

                updateObjectList();
                draw();
                alert('World loaded successfully!');
            }
        } catch (err) {
            alert('Error loading file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Clear all
function clearAll() {
    if (confirm('Clear all objects?')) {
        worldObjects = [];
        letterPositions = [];
        enemies = [];
        updateObjectList();
        draw();
    }
}

// Toggle free placement mode
function toggleFreePlace() {
    freePlace = !freePlace;
    const button = document.getElementById('freePlaceToggle');
    if (button) {
        button.textContent = freePlace ? '🔓 Free Place: ON' : '🔒 Grid Snap: ON';
        button.style.background = freePlace ? '#4CAF50' : '#666';
    }
}

// Toggle grid
function toggleGrid() {
    showGrid = !showGrid;
    draw();
}

// Initial draw
draw();

console.log('World Builder loaded! Right-click or Ctrl+Click to pan, Mouse wheel to zoom');
