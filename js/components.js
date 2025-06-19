// 24HD Component Loader System with Smart Path Detection
// Auto-detects correct file paths based on current location

class PathDetector {
    static getBasePath() {
        const currentPath = window.location.pathname;
        
        // If we're in a subfolder, go up one level
        if (currentPath.includes('/Main-Pages/') || currentPath.includes('/js/') || currentPath.includes('/css/')) {
            return '../';
        }
        
        // If we're in root, use current directory
        return './';
    }
    
    static getComponentPath(filename) {
        const basePath = this.getBasePath();
        return `${basePath}${filename}`;
    }
}

class MobileNavigationLoader {
    static async load() {
        try {
            const componentPath = PathDetector.getComponentPath('../Main-Components/mobile-menu.html');
            console.log(`📱 Loading mobile menu from: ${componentPath}`);
            
            const response = await fetch(componentPath);
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
            const navContainer = document.querySelector('.nav-container, .locker-nav .nav-container, nav .nav-container');
            if (navContainer) {
                navContainer.insertAdjacentHTML('beforeend', navHTML);
            } else {
                console.warn('⚠️ .nav-container not found, adding to body');
                document.body.insertAdjacentHTML('beforeend', navHTML);
            }
            
            // Initialize mobile navigation after loading
            this.initializeMobileNavigation();
            
            console.log('📱 Mobile navigation loaded successfully');
        } catch (error) {
            console.error('❌ Mobile navigation load failed:', error);
        }
    }
    
    static initializeMobileNavigation() {
        // Wait a bit for DOM to update
        setTimeout(() => {
            const hamburger = document.getElementById('mobileMenuToggle');
            const overlay = document.getElementById('mobileMenuOverlay');
            
            if (!hamburger || !overlay) {
                console.error('❌ 햄버거 버튼 또는 오버레이를 찾을 수 없습니다');
                return;
            }
            
            // Toggle menu
            hamburger.addEventListener('click', () => {
                const isActive = hamburger.classList.toggle('active');
                overlay.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
                
                console.log(`📱 모바일 메뉴 ${isActive ? '열림' : '닫힘'}`);
            });
            
            // Close when clicking links
            const navLinks = overlay.querySelectorAll('.mobile-nav-links a, .mobile-nav-actions a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu(hamburger, overlay);
                });
            });
            
            // Close when clicking overlay background
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeMenu(hamburger, overlay);
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    this.closeMenu(hamburger, overlay);
                }
            });
            
            // Close on orientation change
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.closeMenu(hamburger, overlay);
                }, 100);
            });
            
            console.log('✅ 모바일 네비게이션 이벤트 초기화 완료');
        }, 100);
    }
    
    static closeMenu(hamburger, overlay) {
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

class FooterLoader {
    static async load() {
        try {
            const componentPath = PathDetector.getComponentPath('../Main-Components/footer.html');
            console.log(`🦶 Loading footer from: ${componentPath}`);
            
            const response = await fetch(componentPath);
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
        }
    }
}

// Component Manager - orchestrates all component loading
class ComponentManager {
    static async loadAll() {
        console.log('🚀 Starting component loading...');
        console.log(`📁 Base path: ${PathDetector.getBasePath()}`);
        
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
    PerformanceMonitor,
    PathDetector
};

console.log('📦 24HD Component System initialized with smart path detection');