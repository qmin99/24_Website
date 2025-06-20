// 24HD Component Loader System
// All-in-one component management for 24HD website

class MobileNavigationLoader {
  static async load() {
    try {
      // Dynamic path detection based on current location
      const currentPath = window.location.pathname;
      const isRootIndex =
        currentPath === "/" ||
        currentPath.endsWith("/index.html") ||
        currentPath.includes("/index.html") ||
        !currentPath.includes("/");

      // Set correct path based on file location
      const componentPath = isRootIndex
        ? "Main-Components/mobile-menu.html"
        : "../Main-Components/mobile-menu.html";

      console.log("📍 Current path:", currentPath);
      console.log("🔍 Loading mobile menu from:", componentPath);

      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const navHTML = await response.text();

      // Remove existing mobile navigation elements
      const existingToggle = document.querySelector(".mobile-menu-toggle");
      const existingOverlay = document.querySelector(".mobile-menu-overlay");
      if (existingToggle) existingToggle.remove();
      if (existingOverlay) existingOverlay.remove();

      // Add hamburger button to navigation container
      const navContainer = document.querySelector(".nav-container");
      if (navContainer) {
        navContainer.insertAdjacentHTML("beforeend", navHTML);
        console.log("📱 Mobile navigation loaded successfully");
      } else {
        console.warn("⚠️ .nav-container not found, adding to body");
        document.body.insertAdjacentHTML("beforeend", navHTML);
      }
    } catch (error) {
      console.error("❌ Mobile navigation load failed:", error);
      // Fallback: show error message to user in development
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.warn("🚨 Development mode: Component path issue detected");
        console.warn("🔧 Check if Main-Components/mobile-menu.html exists");
      }
    }
  }
}

class FooterLoader {
  static async load() {
    try {
      // Dynamic path detection for footer
      const currentPath = window.location.pathname;
      const isRootIndex =
        currentPath === "/" ||
        currentPath.endsWith("/index.html") ||
        currentPath.includes("/index.html") ||
        !currentPath.includes("/");

      const componentPath = isRootIndex
        ? "Main-Components/footer.html"
        : "../Main-Components/footer.html";

      console.log("🦶 Loading footer from:", componentPath);

      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const footerHTML = await response.text();

      // Remove existing footer elements
      const existingFooters = document.querySelectorAll(
        "footer, .championship-footer, .locker-footer, .hd24-footer"
      );
      existingFooters.forEach((footer) => footer.remove());

      // Add new footer to end of body
      document.body.insertAdjacentHTML("beforeend", footerHTML);

      console.log("✅ Footer loaded successfully");
    } catch (error) {
      console.error("❌ Footer load failed:", error);
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.warn("🚨 Development mode: Footer component path issue");
        console.warn("🔧 Check if Main-Components/footer.html exists");
      }
    }
  }
}

// Component Manager - orchestrates all component loading
class ComponentManager {
  static async loadAll() {
    console.log("🚀 Starting component loading...");

    // 현재 페이지 감지
    const currentPage = window.location.pathname.toLowerCase();
    const isPortalPage = currentPage.includes("portal.html");

    // Load components conditionally
    const promises = [MobileNavigationLoader.load()];

    // Portal 페이지가 아닐 때만 footer 로드
    if (!isPortalPage) {
      promises.push(FooterLoader.load());
    }

    try {
      await Promise.all(promises);
      console.log("🎉 All components loaded successfully");

      this.initializeMobileMenu();

      const event = new CustomEvent("componentsLoaded", {
        detail: { timestamp: Date.now() },
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("💥 Some components failed to load:", error);
    }
  }
  // Initialize mobile menu functionality
  static initializeMobileMenu() {
    const hamburger = document.getElementById("mobileMenuToggle");
    const overlay = document.getElementById("mobileMenuOverlay");

    if (!hamburger || !overlay) {
      console.error("❌ Mobile menu elements not found");
      return;
    }

    // Toggle menu
    hamburger.addEventListener("click", () => {
      const isActive = hamburger.classList.toggle("active");
      overlay.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isActive);
      document.body.style.overflow = isActive ? "hidden" : "";

      // Portal 페이지에서 부드러운 quantum 효과! 🌌
      if (document.body.classList.contains("portal-theme")) {
        this.handleQuantumAnimation(isActive);
      }

      console.log(
        `📱 Mobile menu ${isActive ? "opened" : "closed"} - smooth quantum! ✨`
      );
    });

    // Close when clicking links
    const navLinks = overlay.querySelectorAll(
      ".mobile-nav-links a, .mobile-nav-actions a"
    );
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu(hamburger, overlay);
      });
    });

    // Close when clicking overlay background
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeMobileMenu(hamburger, overlay);
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        this.closeMobileMenu(hamburger, overlay);
      }
    });

    // Close on orientation change
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.closeMobileMenu(hamburger, overlay);
      }, 100);
    });

    console.log("✅ Mobile menu initialized with smooth quantum effects");
  }

  // 부드러운 quantum 애니메이션 처리 🌊
  static handleQuantumAnimation(isActive) {
    const quantumTabs = document.querySelectorAll(
      ".quantum-tabs, .quantum-tab"
    );

    if (quantumTabs.length === 0) return;

    // 렌더링 최적화를 위해 requestAnimationFrame 사용
    requestAnimationFrame(() => {
      quantumTabs.forEach((tab) => {
        // 기존 애니메이션 클래스 초기화
        tab.classList.remove("quantum-disappear", "quantum-restore");
        tab.style.animationDelay = ""; // delay 제거로 동시 실행

        // 렌더링 최적화 힌트
        tab.style.willChange = "transform, opacity, filter";

        if (isActive) {
          // 모든 탭 동시에 사라짐 ✨
          requestAnimationFrame(() => {
            tab.classList.add("quantum-disappear");
          });
        } else {
          // 모든 탭 동시에 복원 🔮
          requestAnimationFrame(() => {
            tab.classList.add("quantum-restore");

            // 애니메이션 완료 후 정리
            setTimeout(() => {
              tab.classList.remove("quantum-restore");
              tab.style.willChange = "auto"; // 메모리 절약
            }, 800);
          });
        }
      });
    });
  }

  static closeMobileMenu(hamburger, overlay) {
    hamburger.classList.remove("active");
    overlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    // Portal 페이지에서 부드러운 quantum 복원
    if (document.body.classList.contains("portal-theme")) {
      this.handleQuantumAnimation(false);
    }
  }
  // Utility method to reload specific component
  static async reload(componentName) {
    switch (componentName) {
      case "mobile-menu":
        await MobileNavigationLoader.load();
        this.initializeMobileMenu();
        break;
      case "footer":
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
    body.classList.remove(
      "index-theme",
      "matches-theme",
      "uniform-theme",
      "portal-theme"
    );

    // Apply page-specific theme
    if (
      currentPage.includes("index.html") ||
      currentPage === "/" ||
      currentPage === ""
    ) {
      body.classList.add("index-theme");
    } else if (currentPage.includes("matches.html")) {
      body.classList.add("matches-theme");
    } else if (currentPage.includes("uniform.html")) {
      body.classList.add("uniform-theme");
    } else if (currentPage.includes("portal.html")) {
      body.classList.add("portal-theme");
    }

    console.log(`🎨 Theme applied: ${body.className || "default"}`);
  }
}

// Performance Monitor - optional debugging utility
class PerformanceMonitor {
  static startTiming(label) {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-start`);
    }
  }

  static endTiming(label) {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measure = performance.getEntriesByName(label)[0];
      console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
    }
  }
}

// Link Fix Utility - fixes relative links based on page location
class LinkFixer {
  static fixAllLinks() {
    const currentPath = window.location.pathname;
    const isRootIndex =
      currentPath === "/" ||
      currentPath.endsWith("/index.html") ||
      currentPath.includes("/index.html") ||
      !currentPath.includes("/");

    // Fix navigation links
    const navLinks = document.querySelectorAll("a[href]");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      // Skip external links and anchor links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:")
      ) {
        return;
      }

      // Fix relative links based on location
      if (isRootIndex) {
        // From root, add Main-Pages/ prefix for internal pages
        if (href.includes(".html") && !href.includes("/")) {
          if (href !== "index.html") {
            link.setAttribute("href", `Main-Pages/${href}`);
          }
        }
      } else {
        // From subfolder, links should work as-is or need ../
        if (href === "index.html") {
          link.setAttribute("href", "../index.html");
        }
      }
    });

    console.log("🔗 Links fixed for current location");
  }
}

// Main initialization function
async function initializeComponents() {
  PerformanceMonitor.startTiming("component-loading");

  // Apply theme first for immediate visual feedback
  ThemeManager.applyPageTheme();

  // Load all components
  await ComponentManager.loadAll();

  // Fix links after components are loaded
  setTimeout(() => {
    LinkFixer.fixAllLinks();
  }, 100);

  PerformanceMonitor.endTiming("component-loading");

  console.log("🏁 24HD component system ready");
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeComponents);

// Handle page visibility changes (useful for SPA-like behavior)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Re-apply theme when page becomes visible (useful for cached pages)
    ThemeManager.applyPageTheme();
  }
});

// Global error handler for component-related errors
window.addEventListener("error", (event) => {
  if (
    event.filename &&
    (event.filename.includes("Main-Components/") ||
      event.filename.includes("components.js"))
  ) {
    console.error("🚨 Component system error:", event.error);
  }
});

// Export for manual usage (if needed)
window.HD24Components = {
  ComponentManager,
  ThemeManager,
  MobileNavigationLoader,
  FooterLoader,
  PerformanceMonitor,
  LinkFixer,
};

console.log("📦 24HD Component System initialized - Ready for deployment! 🚀");
