// Web Audio API synthesized coin sound
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function createCoinSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    return {
        play: () => {
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    };
}

export { createCoinSound };
