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
        
        container.appendChild(icon);
    }
}

// Create new floating icons when existing ones finish animating
document.addEventListener('DOMContentLoaded', () => {
    createFloatingIcons();
    
    const container = document.querySelector('.floating-icons');
    container.addEventListener('animationend', (e) => {
        if (e.target.classList.contains('floating-icon')) {
            e.target.remove();
            createFloatingIcons();
        }
    });
});
