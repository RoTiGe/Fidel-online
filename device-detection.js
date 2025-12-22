/**
 * Device Detection Utility
 * Provides device type, screen size, and responsive helpers
 */

const DeviceDetection = {
    // Device type detection
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && !this.isPhone();
    },

    isPhone() {
        return /iPhone|iPod|Android(?!.*Tablet)/i.test(navigator.userAgent);
    },

    isDesktop() {
        return !this.isMobile();
    },

    // Touch support detection
    hasTouch() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    },

    // Screen size detection
    getScreenSize() {
        return {
            width: window.screen.width,
            height: window.screen.height,
            dpr: window.devicePixelRatio
        };
    },

    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    // Breakpoint detection
    isMobileBreakpoint() {
        return window.innerWidth < 768;
    },

    isTabletBreakpoint() {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    },

    isDesktopBreakpoint() {
        return window.innerWidth >= 1024;
    },

    // Orientation detection
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    },

    isPortrait() {
        return window.innerHeight > window.innerWidth;
    },

    isLandscape() {
        return window.innerWidth > window.innerHeight;
    },

    // Device info summary
    getDeviceInfo() {
        return {
            type: this.isMobile() ? 'mobile' : 'desktop',
            isPhone: this.isPhone(),
            isTablet: this.isTablet(),
            isDesktop: this.isDesktop(),
            hasTouch: this.hasTouch(),
            screen: this.getScreenSize(),
            viewport: this.getViewportSize(),
            orientation: this.getOrientation(),
            breakpoint: this.isMobileBreakpoint() ? 'mobile' : 
                       this.isTabletBreakpoint() ? 'tablet' : 'desktop'
        };
    },

    // Log device info (for debugging)
    logDeviceInfo() {
        console.log('Device Info:', this.getDeviceInfo());
    }
};

// Make available globally
window.DeviceDetection = DeviceDetection;

// Auto-log on load (optional, comment out if not needed)
document.addEventListener('DOMContentLoaded', () => {
    // Uncomment to debug:
    // DeviceDetection.logDeviceInfo();
});

