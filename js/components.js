// 24HD Component Loader System
// All-in-one component management for 24HD website

class MobileNavigationLoader {
    static async load() {
        try {
            const response = await fetch('../Main-Components/mobile-menu.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const navHTML = await response.text();
            
            // Remove existing mobile navigation elements
            const existingToggle = document.querySelector('.mobile-menu-toggle');
            const existingOverlay = document.querySelector('.mobile-menu-overlay');
            if (existingToggle) existingToggle.remove();
            if (existingOverlay) existingOverlay.remove();
            
            // Add hamburger button to navigation container
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.insertAdjacentHTML('beforeend', navHTML);
            } else {
                console.warn('⚠️ .nav-container not found, adding to body');
                document.body.insertAdjacentHTML('beforeend', navHTML);
            }
            
            console.log('📱 Mobile navigation loaded successfully');
        } catch (error) {
            console.error('❌ Mobile navigation load failed:', error);
            // Fallback: show error message to user in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('🚨 Development mode: ../Main-Components/mobile-menu.html not found');
            }
        }
    }
}

class FooterLoader {
    static async load() {
        try {
            const response = await fetch('../Main-Components/footer.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const footerHTML = await response.text();
            
            // Remove existing footer elements
            const existingFooters = document.querySelectorAll('footer, .championship-footer, .locker-footer, .hd24-footer');
            existingFooters.forEach(footer => footer.remove());
            
            // Add new footer to end of body
            document.body.insertAdjacentHTML('beforeend', footerHTML);
            
            console.log('✅ Footer loaded successfully');
        } catch (error) {
            console.error('❌ Footer load failed:', error);
            // Fallback: show error message to user in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('🚨 Development mode: ../Main-Components/footer.html not found');
            }
        }
    }
}

// Component Manager - orchestrates all component loading
class ComponentManager {
    static async loadAll() {
        console.log('🚀 Starting component loading...');
        
        // Load components in parallel for better performance
        const promises = [
            MobileNavigationLoader.load(),
            FooterLoader.load()
        ];
        
        try {
            await Promise.all(promises);
            console.log('🎉 All components loaded successfully');
            
            // Dispatch custom event when all components are ready
            const event = new CustomEvent('componentsLoaded', {
                detail: { timestamp: Date.now() }
            });
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('💥 Some components failed to load:', error);
        }
    }
    
    // Utility method to reload specific component
    static async reload(componentName) {
        switch (componentName) {
            case 'mobile-menu':
                await MobileNavigationLoader.load();
                break;
            case 'footer':
                await FooterLoader.load();
                break;
            default:
                console.warn(`Unknown component: ${componentName}`);
        }
    }
}

// Theme Manager - handles page-specific theming
class ThemeManager {
    static applyPageTheme() {
        const body = document.body;
        const currentPage = window.location.pathname.toLowerCase();
        
        // Clear existing theme classes
        body.classList.remove('index-theme', 'matches-theme', 'uniform-theme', 'portal-theme');
        
        // Apply page-specific theme
        if (currentPage.includes('index.html') || currentPage === '/' || currentPage === '') {
            body.classList.add('index-theme');
        } else if (currentPage.includes('matches.html')) {
            body.classList.add('matches-theme');
        } else if (currentPage.includes('uniform.html')) {
            body.classList.add('uniform-theme');
        } else if (currentPage.includes('portal.html')) {
            body.classList.add('portal-theme');
        }
        
        console.log(`🎨 Theme applied: ${body.className || 'default'}`);
    }
}

// Performance Monitor - optional debugging utility
class PerformanceMonitor {
    static startTiming(label) {
        if (typeof performance !== 'undefined') {
            performance.mark(`${label}-start`);
        }
    }
    
    static endTiming(label) {
        if (typeof performance !== 'undefined') {
            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);
            
            const measure = performance.getEntriesByName(label)[0];
            console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
        }
    }
}

// Main initialization function
async function initializeComponents() {
    PerformanceMonitor.startTiming('component-loading');
    
    // Apply theme first for immediate visual feedback
    ThemeManager.applyPageTheme();
    
    // Load all components
    await ComponentManager.loadAll();
    
    PerformanceMonitor.endTiming('component-loading');
    
    console.log('🏁 24HD component system ready');
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeComponents);

// Handle page visibility changes (useful for SPA-like behavior)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-apply theme when page becomes visible (useful for cached pages)
        ThemeManager.applyPageTheme();
    }
});

// Global error handler for component-related errors
window.addEventListener('error', (event) => {
    if (event.filename && (event.filename.includes('../Main-Components/mobile-menu.html') || event.filename.includes('../Main-Components/footer.html'))) {
        console.error('🚨 Component error detected:', event.error);
    }
});

// Export for manual usage (if needed)
window.HD24Components = {
    ComponentManager,
    ThemeManager,
    MobileNavigationLoader,
    FooterLoader,
    PerformanceMonitor
};

console.log('📦 24HD Component System initialized');