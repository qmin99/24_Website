// js/animations.js
console.log("animations.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Logic (Fade In Up)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Optional: stop observing once animated
                }
            });
        }, {
            rootMargin: '0px', // How far from the viewport edge to trigger
            threshold: 0.1  // What percentage of the element needs to be visible
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- Other potential animations can be added below ---

    // Example: Smooth scroll for anchor links (if not already handled by CSS scroll-behavior)
    // This is a more robust version than just CSS for wider browser support or more complex needs.
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         const hrefAttribute = this.getAttribute('href');
    //         // Ensure it's not just a hash for a tab or accordion
    //         if (hrefAttribute && hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) {
    //             e.preventDefault();
    //             document.querySelector(hrefAttribute).scrollIntoView({
    //                 behavior: 'smooth'
    //             });
    //         }
    //     });
    // });
});
