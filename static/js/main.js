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
    
    mainContent.classList.remove('content-hidden');
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
        
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 100);
}

// Initialize Tone.js
let synth = null;
async function initializeTone() {
    try {
        await Tone.start();
        synth = new Tone.Synth({
            oscillator: { type: "square" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
        }).toDestination();
        return true;
    } catch (error) {
        console.warn('Tone.js initialization failed:', error);
        return false;
    }
}

// Create floating icons
function createFloatingIcons() {
    const icons = ['doge.svg', 'bitcoin.svg', 'ethereum.svg', 'rocket.svg'];
    const container = document.querySelector('.floating-icons');

    for (let i = 0; i < 10; i++) {
        const icon = document.createElement('img');
        icon.src = `/static/images/${icons[Math.floor(Math.random() * icons.length)]}`;
        icon.className = 'floating-icon';
        
        // Random starting position and animation
        icon.style.left = `${Math.random() * 100}vw`;
        icon.style.animationDuration = `${15 + Math.random() * 10}s`;
        icon.style.animationDelay = `${Math.random() * 5}s`;
        
        // Click handler with sound
        icon.addEventListener('click', async () => {
            if (!icon.classList.contains('clicked') && synth) {
                icon.classList.add('clicked');
                try {
                    synth.triggerAttackRelease("C5", "16n");
                } catch (error) {
                    console.warn('Sound playback failed:', error);
                }
                setTimeout(() => {
                    icon.classList.remove('clicked');
                }, 1000);
            }
        });
        
        container.appendChild(icon);
    }
}

// Initialize dark mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '🌜';
    }

    darkModeToggle.addEventListener('click', async () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDarkMode ? '🌜' : '🌞';
        localStorage.setItem('darkMode', isDarkMode);
        
        // Play toggle sound
        if (synth) {
            try {
                synth.triggerAttackRelease(isDarkMode ? "G4" : "E4", "8n");
            } catch (error) {
                console.warn('Sound playback failed:', error);
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const messageInterval = updateLoadingText();
    
    try {
        // Initialize features
        await initializeTone();
        initializeDarkMode();
        createFloatingIcons();
        
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
        clearInterval(messageInterval);
        hideLoadingScreen();
    }
});
