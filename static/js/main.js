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
    
    const interval = setInterval(() => {
        loadingText.textContent = loadingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 1000);

    return interval;
}

function hideLoadingScreen() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    
    // Fade out loading screen
    loadingOverlay.style.opacity = '0';
    
    // Show main content
    mainContent.classList.remove('content-hidden');
    mainContent.style.opacity = '1';
    
    // Remove loading overlay after animation
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 500);
}

// Initialize sound effects
const sfx = {
    hover: new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination(),
    
    click: new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
    }).toDestination(),
    
    coin: new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.1, release: 0.1 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
    }).toDestination(),
    
    rocket: new Tone.Synth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 1 }
    }).toDestination()
};

// Initialize volume
Object.values(sfx).forEach(synth => {
    synth.volume.value = -20; // Set a reasonable default volume
});

// Dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '🌜';
        updateChart(true);
    }

    darkModeToggle.addEventListener('click', async () => {
        await Tone.start();
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDarkMode ? '🌜' : '🌞';
        localStorage.setItem('darkMode', isDarkMode);
        updateChart(isDarkMode);
        
        // Play toggle sound with different pitches for dark/light mode
        sfx.click.triggerAttackRelease(isDarkMode ? "G4" : "E4", "8n");
    });

    // Add hover sound effect
    darkModeToggle.addEventListener('mouseenter', async () => {
        await Tone.start();
        sfx.hover.triggerAttackRelease("C5", "32n");
    });

    // Listen for system dark mode changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                darkModeToggle.textContent = '🌜';
                updateChart(true);
            } else {
                document.body.classList.remove('dark-mode');
                darkModeToggle.textContent = '🌞';
                updateChart(false);
            }
        }
    });
}

// Create floating background icons
function createFloatingIcons() {
    const icons = ['doge.svg', 'bitcoin.svg', 'ethereum.svg', 'rocket.svg'];
    const container = document.querySelector('.floating-icons');
    
    for (let i = 0; i < 15; i++) {
        const icon = document.createElement('img');
        icon.src = `/static/images/${icons[Math.floor(Math.random() * icons.length)]}`;
        icon.className = 'floating-icon';
        
        // Random starting position
        icon.style.left = `${Math.random() * 100}vw`;
        // Random animation duration
        icon.style.animationDuration = `${15 + Math.random() * 10}s`;
        // Random animation delay
        icon.style.animationDelay = `${Math.random() * 15}s`;
        
        // Add click handler
        icon.addEventListener('click', async () => {
            if (!icon.classList.contains('clicked')) {
                icon.classList.add('clicked');
                await Tone.start();
                // Play coin sound with random pitch variation
                sfx.coin.triggerAttackRelease(200 + Math.random() * 100);
                setTimeout(() => {
                    icon.classList.remove('clicked');
                }, 1000);
            }
        });

        // Add hover sound effect
        icon.addEventListener('mouseenter', async () => {
            await Tone.start();
            sfx.hover.triggerAttackRelease("E5", "32n");
        });
        
        container.appendChild(icon);
    }
}

// Add interactivity to stat boxes
function initializeStatBoxes() {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
        box.addEventListener('click', async () => {
            if (!box.classList.contains('bounce')) {
                box.classList.add('bounce');
                await Tone.start();
                // Play click sound with random pitch
                sfx.click.triggerAttackRelease("C" + (Math.floor(Math.random() * 2) + 4));
                setTimeout(() => {
                    box.classList.remove('bounce');
                }, 500);
            }
        });

        // Add hover sound effect
        box.addEventListener('mouseenter', async () => {
            await Tone.start();
            sfx.hover.triggerAttackRelease("G4", "32n");
        });
    });
}

// Add "To The Moon" button functionality
function initializeMoonButton() {
    const moonBtn = document.querySelector('.to-the-moon-btn');
    if (moonBtn) {
        moonBtn.addEventListener('click', async () => {
            await Tone.start();
            // Play rocket launch sound sequence
            const notes = ["C4", "E4", "G4", "C5", "E5", "G5"];
            notes.forEach((note, index) => {
                setTimeout(() => {
                    sfx.rocket.triggerAttackRelease(note, "8n");
                }, index * 100);
            });

            // Add launching animation to all elements
            document.querySelectorAll('.content-box, .chart-container').forEach(el => {
                el.classList.add('launching');
            });

            // Reset after animation
            setTimeout(() => {
                document.querySelectorAll('.launching').forEach(el => {
                    el.classList.remove('launching');
                });
            }, 2000);
        });

        // Add hover sound effect
        moonBtn.addEventListener('mouseenter', async () => {
            await Tone.start();
            sfx.hover.triggerAttackRelease("A4", "32n");
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start loading animation
    const messageInterval = updateLoadingText();
    
    // Initialize features
    initializeDarkMode();
    createFloatingIcons();
    initializeStatBoxes();
    initializeMoonButton();
    
    const container = document.querySelector('.floating-icons');
    container.addEventListener('animationend', (e) => {
        if (e.target.classList.contains('floating-icon')) {
            e.target.remove();
            createFloatingIcons();
        }
    });

    // Hide loading screen immediately after initialization
    clearInterval(messageInterval);
    hideLoadingScreen();
});
