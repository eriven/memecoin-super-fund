// Previous code remains the same until line 187...

// Add "To The Moon" button functionality
function initializeMoonButton() {
    const moonBtn = document.querySelector('.to-the-moon-btn');
    if (moonBtn) {
        moonBtn.addEventListener('click', async () => {
            if (!moonBtn.classList.contains('launching')) {
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
            }
        });

        // Add hover sound effect
        moonBtn.addEventListener('mouseenter', async () => {
            await Tone.start();
            sfx.hover.triggerAttackRelease("A4", "32n");
        });
    }
}

// ... Rest of the code remains the same
