// Initialize sound effects with error handling
let sfx = {};

async function initializeSoundEffects() {
    try {
        await Tone.start();
        console.log("Tone.js started successfully");
        
        sfx = {
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

        console.log("Sound effects initialized successfully");
    } catch (error) {
        console.error("Failed to initialize Tone.js:", error);
        // Create dummy sound objects that do nothing
        sfx = {
            hover: { triggerAttackRelease: () => {} },
            click: { triggerAttackRelease: () => {} },
            coin: { triggerAttackRelease: () => {} },
            rocket: { triggerAttackRelease: () => {} }
        };
    }
}

// Add "To The Moon" button functionality
function initializeMoonButton() {
    const moonBtn = document.querySelector('.to-the-moon-btn');
    if (moonBtn) {
        moonBtn.addEventListener('click', async () => {
            if (!moonBtn.classList.contains('launching')) {
                try {
                    await Tone.start();
                    // Play rocket launch sound sequence
                    const notes = ["C4", "E4", "G4", "C5", "E5", "G5"];
                    notes.forEach((note, index) => {
                        setTimeout(() => {
                            sfx.rocket.triggerAttackRelease(note, "8n");
                        }, index * 100);
                    });

                    // Add launching animation to all elements
                    const elementsToLaunch = document.querySelectorAll('.content-box, .chart-container');
                    elementsToLaunch.forEach(el => {
                        el.classList.add('launching');
                    });

                    // Reset after animation
                    setTimeout(() => {
                        elementsToLaunch.forEach(el => {
                            el.classList.remove('launching');
                        });
                    }, 2000);
                } catch (error) {
                    console.error("Error during rocket launch:", error);
                }
            }
        });

        // Add hover sound effect
        moonBtn.addEventListener('mouseenter', async () => {
            try {
                await Tone.start();
                sfx.hover.triggerAttackRelease("A4", "32n");
            } catch (error) {
                console.error("Error playing hover sound:", error);
            }
        });
    }
}

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
        try {
            await Tone.start();
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            darkModeToggle.textContent = isDarkMode ? '🌜' : '🌞';
            localStorage.setItem('darkMode', isDarkMode);
            updateChart(isDarkMode);
            
            // Play toggle sound with different pitches for dark/light mode
            sfx.click.triggerAttackRelease(isDarkMode ? "G4" : "E4", "8n");
        } catch (error) {
            console.error("Error during dark mode toggle:", error);
        }
    });

    // Add hover sound effect
    darkModeToggle.addEventListener('mouseenter', async () => {
        try {
            await Tone.start();
            sfx.hover.triggerAttackRelease("C5", "32n");
        } catch (error) {
            console.error("Error playing hover sound:", error);
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
        
        // Add error handling for image loading
        icon.onerror = function() {
            console.error(`Failed to load icon: ${icon.src}`);
            icon.style.display = 'none';
        };
        
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
                try {
                    await Tone.start();
                    sfx.coin.triggerAttackRelease(200 + Math.random() * 100);
                } catch (error) {
                    console.error("Error playing coin sound:", error);
                }
                setTimeout(() => {
                    icon.classList.remove('clicked');
                }, 1000);
            }
        });

        // Add hover sound effect
        icon.addEventListener('mouseenter', async () => {
            try {
                await Tone.start();
                sfx.hover.triggerAttackRelease("E5", "32n");
            } catch (error) {
                console.error("Error playing hover sound:", error);
            }
        });
        
        container.appendChild(icon);
    }
}

// Initialize stat boxes
function initializeStatBoxes() {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
        box.addEventListener('click', async () => {
            if (!box.classList.contains('bounce')) {
                box.classList.add('bounce');
                try {
                    await Tone.start();
                    sfx.click.triggerAttackRelease("C" + (Math.floor(Math.random() * 2) + 4));
                } catch (error) {
                    console.error("Error playing stat box sound:", error);
                }
                setTimeout(() => {
                    box.classList.remove('bounce');
                }, 500);
            }
        });

        // Add hover sound effect
        box.addEventListener('mouseenter', async () => {
            try {
                await Tone.start();
                sfx.hover.triggerAttackRelease("G4", "32n");
            } catch (error) {
                console.error("Error playing hover sound:", error);
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM Content Loaded - Starting initialization...");
    
    try {
        await initializeSoundEffects();
        initializeDarkMode();
        createFloatingIcons();
        initializeStatBoxes();
        initializeMoonButton();
        console.log("Features initialized successfully");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});
