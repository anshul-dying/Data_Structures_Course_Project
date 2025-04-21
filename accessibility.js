/* Accessibility Enhancements */

// Detect whether the user is navigating via keyboard or mouse
document.addEventListener('DOMContentLoaded', function() {
    // Add class to body when mouse is used for interaction
    document.body.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });

    // Remove class when Tab key is used, indicating keyboard navigation
    document.body.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });

    // Enhance focus visibility for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, [tabindex]');
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            if (!document.body.classList.contains('using-mouse')) {
                this.classList.add('keyboard-focus');
            }
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
});

// Add aria-labels to control buttons for screen readers
function enhanceControlsAccessibility() {
    // Wait for the controls to be added to the DOM
    setTimeout(() => {
        const skipBackButton = document.querySelector('button[value="<<"]');
        if (skipBackButton) skipBackButton.setAttribute('aria-label', 'Skip to beginning');
        
        const stepBackButton = document.querySelector('button[value="<"]');
        if (stepBackButton) stepBackButton.setAttribute('aria-label', 'Step backward');
        
        const playPauseButton = document.querySelector('button.playPauseButton');
        if (playPauseButton) playPauseButton.setAttribute('aria-label', 'Play or pause animation');
        
        const stepForwardButton = document.querySelector('button[value=">"]');
        if (stepForwardButton) stepForwardButton.setAttribute('aria-label', 'Step forward');
        
        const skipForwardButton = document.querySelector('button[value=">>"]');
        if (skipForwardButton) skipForwardButton.setAttribute('aria-label', 'Skip to end');
    }, 1000);
}

// Run accessibility enhancements when page loads
window.addEventListener('load', enhanceControlsAccessibility); 