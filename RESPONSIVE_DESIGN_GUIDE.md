# Responsive Design Guide - Mobile & Desktop Detection

## ✅ Yes, It's Possible!

JavaScript and HTML can easily detect device type, screen size, and modify content accordingly.

---

## 🔍 Method 1: Detect Mobile Device (JavaScript)

### Using User Agent
```javascript
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    console.log("Running on mobile device");
} else {
    console.log("Running on desktop/laptop");
}
```

### Using Touch Events
```javascript
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}
```

---

## 📐 Method 2: Get Screen Size (JavaScript)

### Window Dimensions
```javascript
// Get viewport size (visible area)
const width = window.innerWidth;
const height = window.innerHeight;

console.log(`Viewport: ${width}x${height}`);

// Get full screen size
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;

console.log(`Screen: ${screenWidth}x${screenHeight}`);
```

### Device Pixel Ratio
```javascript
const dpr = window.devicePixelRatio;
console.log(`Device pixel ratio: ${dpr}`);
// High DPI devices (Retina) have dpr > 1
```

---

## 🎨 Method 3: CSS Media Queries (Recommended)

### Responsive Breakpoints
```css
/* Mobile First Approach */
body {
    font-size: 14px;
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    body {
        font-size: 16px;
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    body {
        font-size: 18px;
        padding: 40px;
    }
}

/* Large Desktop */
@media (min-width: 1440px) {
    body {
        font-size: 20px;
        padding: 60px;
    }
}
```

### Orientation Detection
```css
/* Portrait */
@media (orientation: portrait) {
    .container {
        width: 100%;
    }
}

/* Landscape */
@media (orientation: landscape) {
    .container {
        width: 50%;
    }
}
```

---

## 🔄 Method 4: Modify Content with JavaScript

### Show/Hide Elements
```javascript
function adaptToDevice() {
    const isMobile = window.innerWidth < 768;
    
    // Show/hide elements based on device
    document.getElementById('mobileMenu').style.display = isMobile ? 'block' : 'none';
    document.getElementById('desktopMenu').style.display = isMobile ? 'none' : 'block';
    
    // Change layout
    const container = document.getElementById('container');
    container.style.flexDirection = isMobile ? 'column' : 'row';
}

// Run on load and resize
window.addEventListener('load', adaptToDevice);
window.addEventListener('resize', adaptToDevice);
```

### Dynamic Content Loading
```javascript
function loadContent() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Load mobile-optimized content
        document.getElementById('content').innerHTML = '<p>Mobile version</p>';
    } else {
        // Load desktop content
        document.getElementById('content').innerHTML = '<p>Desktop version</p>';
    }
}
```

---

## 📱 Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 10px;
            font-family: Arial, sans-serif;
        }
        
        .container {
            display: flex;
            gap: 20px;
        }
        
        .sidebar {
            width: 300px;
        }
        
        .content {
            flex: 1;
        }
        
        /* Mobile */
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
            }
            .mobile-only {
                display: block;
            }
            .desktop-only {
                display: none;
            }
        }
        
        /* Desktop */
        @media (min-width: 769px) {
            .mobile-only {
                display: none;
            }
            .desktop-only {
                display: block;
            }
        }
    </style>
</head>
<body>
    <h1 id="title">Responsive App</h1>
    
    <div class="mobile-only">
        <p>📱 Mobile Menu</p>
    </div>
    
    <div class="desktop-only">
        <p>🖥️ Desktop Menu</p>
    </div>
    
    <div class="container">
        <div class="sidebar">Sidebar</div>
        <div class="content">Content</div>
    </div>
    
    <script>
        // Detect device
        function detectDevice() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            console.log(`Device: ${isMobile ? 'Mobile' : 'Desktop'}`);
            console.log(`Screen: ${width}x${height}`);
            
            // Modify content
            const title = document.getElementById('title');
            if (isMobile) {
                title.textContent = '📱 Mobile App';
            } else {
                title.textContent = '🖥️ Desktop App';
            }
        }
        
        // Run on load and resize
        window.addEventListener('load', detectDevice);
        window.addEventListener('resize', detectDevice);
    </script>
</body>
</html>
```

---

## 🎯 Best Practices

1. **Use CSS Media Queries First** - More efficient than JavaScript
2. **Mobile-First Approach** - Design for mobile, enhance for desktop
3. **Viewport Meta Tag** - Always include: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
4. **Test on Real Devices** - Browser DevTools mobile emulation isn't perfect
5. **Touch-Friendly** - Make buttons larger on mobile (min 44x44px)
6. **Optimize Images** - Serve different sizes for different devices

---

## 📊 Common Breakpoints

```
Mobile:     < 768px
Tablet:     768px - 1024px
Desktop:    1024px - 1440px
Large:      > 1440px
```

---

## ✅ Your Games Can Use This!

Your Fidel Games can:
- ✅ Detect if running on mobile or desktop
- ✅ Adjust canvas size based on screen
- ✅ Show/hide mobile controls
- ✅ Optimize touch controls for mobile
- ✅ Adjust game difficulty based on device
- ✅ Load different assets for different devices

---

**Status:** Ready to implement in your games!

