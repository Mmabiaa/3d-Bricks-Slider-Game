// audioManager.js
const audioState = {
    enabled: localStorage.getItem('soundEnabled') !== 'false'
};

const sounds = {
    start: new Audio('src/assets/sounds/game-start.mp3'),
    gameOver: new Audio('src/assets/sounds/game-over.mp3'),
    bgChange: new Audio('src/assets/sounds/dynamic-background.mp3'),
    splash: new Audio('src/assets/sounds/splash.mp3')
};

function playSound(name) {
    if (audioState.enabled && sounds[name]) {
        sounds[name].pause();
        sounds[name].currentTime = 0;
        let playPromise = sounds[name].play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio playback was prevented: ", error);
            });
        }
    }
}

function toggleSound() {
    audioState.enabled = !audioState.enabled;
    localStorage.setItem('soundEnabled', audioState.enabled);
    updateSoundToggleButton();
}

function updateSoundToggleButton() {
    const btn = document.querySelector('.sound-toggle-btn');
    if (btn) {
        btn.innerHTML = audioState.enabled ? '🔊' : '🔇';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSoundToggleButton();
});
