// js/store.js
console.log("store.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    const colorOptionGroups = document.querySelectorAll('.uniform-card');

    colorOptionGroups.forEach(card => {
        const image = card.querySelector('.uniform-image');
        const colorDots = card.querySelectorAll('.color-dot');

        colorDots.forEach(dot => {
            dot.addEventListener('click', () => {
                // Remove active class from all dots in this card
                colorDots.forEach(d => d.classList.remove('active'));
                // Add active class to the clicked dot
                dot.classList.add('active');
                
                // Change the image source
                const newImageSrc = dot.dataset.image;
                if (newImageSrc && image) {
                    image.src = newImageSrc;
                }
            });
        });
    });
});
