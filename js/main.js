document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.querySelector('.hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('hamburger-active');
            mainNav.classList.toggle('mobile-menu-active');
            
            // ARIA attribute update for hamburger
            const isExpanded = this.classList.contains('hamburger-active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }

    const dropdownLiElements = document.querySelectorAll('#main-nav ul li.has-dropdown');

    dropdownLiElements.forEach(function(li) {
        const anchor = li.querySelector('a');
        const dropdownMenu = li.querySelector('.dropdown-menu'); // Check if a dropdown menu actually exists

        if (anchor && dropdownMenu) { // Only add listener if there's an anchor AND a dropdown
            anchor.addEventListener('click', function(event) {
                // Check if we are in mobile view (where mainNav would have mobile-menu-active)
                if (mainNav && mainNav.classList.contains('mobile-menu-active')) {
                    event.preventDefault(); // Prevent navigation only in mobile for dropdown anchor
                    li.classList.toggle('submenu-open');
                    
                    // ARIA attribute update for submenu
                    const isSubmenuExpanded = li.classList.contains('submenu-open');
                    anchor.setAttribute('aria-expanded', isSubmenuExpanded);
                }
                // If not in mobile view, the default link behavior will occur
            });
            
            // Initialize ARIA attribute for submenu anchors
            anchor.setAttribute('aria-expanded', 'false');
        }
    });

    // Optional: Close mobile menu if user clicks outside of it
    // document.addEventListener('click', function(event) {
    //     if (mainNav && mainNav.classList.contains('mobile-menu-active')) {
    //         const isClickInsideNav = mainNav.contains(event.target);
    //         const isClickOnHamburger = hamburger.contains(event.target);
    //
    //         if (!isClickInsideNav && !isClickOnHamburger) {
    //             mainNav.classList.remove('mobile-menu-active');
    //             if (hamburger) {
    //                 hamburger.classList.remove('hamburger-active');
    //                 hamburger.setAttribute('aria-expanded', 'false');
    //             }
    //         }
    //     }
    // });
});
