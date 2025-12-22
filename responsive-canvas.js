/**
 * Responsive Canvas Utility
 * Handles canvas sizing for different devices and orientations
 */

const ResponsiveCanvas = {
    /**
     * Initialize responsive canvas
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Object} options - Configuration options
     */
    init(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            maxWidth: options.maxWidth || window.innerWidth,
            maxHeight: options.maxHeight || window.innerHeight,
            maintainAspectRatio: options.maintainAspectRatio !== false,
            aspectRatio: options.aspectRatio || 16 / 9,
            padding: options.padding || 0,
            ...options
        };

        this.resize();
        this.attachListeners();
    },

    /**
     * Resize canvas to fit viewport
     */
    resize() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        let width = viewport.width - (this.options.padding * 2);
        let height = viewport.height - (this.options.padding * 2);

        // Maintain aspect ratio if specified
        if (this.options.maintainAspectRatio) {
            const ratio = this.options.aspectRatio;
            const viewportRatio = width / height;

            if (viewportRatio > ratio) {
                width = height * ratio;
            } else {
                height = width / ratio;
            }
        }

        // Apply max dimensions
        width = Math.min(width, this.options.maxWidth);
        height = Math.min(height, this.options.maxHeight);

        this.canvas.width = width;
        this.canvas.height = height;

        // Center canvas
        this.canvas.style.display = 'block';
        this.canvas.style.margin = 'auto';

        return { width, height };
    },

    /**
     * Get canvas dimensions
     */
    getDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
            displayWidth: this.canvas.offsetWidth,
            displayHeight: this.canvas.offsetHeight
        };
    },

    /**
     * Get device pixel ratio for high DPI displays
     */
    getPixelRatio() {
        return window.devicePixelRatio || 1;
    },

    /**
     * Scale canvas for high DPI displays (Retina)
     */
    scaleForHighDPI() {
        const ratio = this.getPixelRatio();
        if (ratio > 1) {
            this.canvas.width *= ratio;
            this.canvas.height *= ratio;
            this.ctx.scale(ratio, ratio);
        }
    },

    /**
     * Get canvas position relative to viewport
     */
    getPosition() {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * Convert mouse/touch coordinates to canvas coordinates
     */
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    },

    /**
     * Attach resize listeners
     */
    attachListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resize(), 100);
        });
    },

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /**
     * Fill canvas with color
     */
    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// Make available globally
window.ResponsiveCanvas = ResponsiveCanvas;

