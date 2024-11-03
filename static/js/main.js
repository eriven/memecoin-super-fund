// Loading screen functionality
const loadingMessages = [
    "Mining Dogecoins...",
    "HODLing Strong...",
    "Checking Elon's tweets...",
    "Buying High...",
    "Planning Moon Mission...",
    "Drawing Technical Analysis...",
    "Counting Lambos...",
    "Reading Reddit DD..."
];

function updateLoadingText() {
    const loadingText = document.querySelector('.loading-text');
    let messageIndex = 0;
    
    return setInterval(() => {
        loadingText.textContent = loadingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 1000);
}

function hideLoadingScreen() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    
    // Remove hidden class and set opacity to trigger transition
    mainContent.classList.remove('content-hidden');
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
        
        // Fade out loading screen
        loadingOverlay.style.opacity = '0';
        
        // Remove loading overlay after animation
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 100);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Start loading animation
    const messageInterval = updateLoadingText();
    
    try {
        // Initialize Tone.js
        await Tone.start();
        
        // Initialize features
        initializeDarkMode();
        createFloatingIcons();
        initializeStatBoxes();
        initializeMoonButton();
        
        // Set up floating icons animation end handler
        const container = document.querySelector('.floating-icons');
        if (container) {
            container.addEventListener('animationend', (e) => {
                if (e.target.classList.contains('floating-icon')) {
                    e.target.remove();
                    createFloatingIcons();
                }
            });
        }

        // Simulate loading time (2 seconds) then hide loading screen
        setTimeout(() => {
            clearInterval(messageInterval);
            hideLoadingScreen();
        }, 2000);
    } catch (error) {
        console.error('Initialization error:', error);
        // Hide loading screen even if there's an error
        clearInterval(messageInterval);
        hideLoadingScreen();
    }
});

// ... rest of your existing JavaScript code ...
