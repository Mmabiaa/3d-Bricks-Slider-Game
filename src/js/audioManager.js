// audioManager.js
const audioState = {
    enabled: localStorage.getItem('soundEnabled') !== 'false'
};

// We will use the Web Audio API for highly optimized playback, 
// especially critical for mobile browsers to avoid HTMLAudioElement lag.
// audioCtx is initialized in utils.js, which loads before this file.
const soundBuffers = {};

async function loadSound(name, url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        soundBuffers[name] = audioBuffer;
    } catch (e) {
        console.error("Failed to load sound:", name, e);
    }
}

// Preload all audio assets into memory buffers
loadSound('start', 'src/assets/sounds/game-start.mp3');
loadSound('gameOver', 'src/assets/sounds/game-over.mp3');
loadSound('bgChange', 'src/assets/sounds/dynamic-background.mp3');
loadSound('splash', 'src/assets/sounds/splash.mp3');

function playSound(name) {
    if (audioState.enabled && soundBuffers[name]) {
        // Many browsers suspend the audio context until a user interacts.
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Create a new buffer source for every playback.
        // This acts as a fire-and-forget node, allowing perfect polyphony (overlapping sounds)
        // and zero playback-reset lag.
        const source = audioCtx.createBufferSource();
        source.buffer = soundBuffers[name];
        source.connect(audioCtx.destination);
        source.start(0);
    }
}

function toggleSound() {
    audioState.enabled = !audioState.enabled;
    localStorage.setItem('soundEnabled', audioState.enabled);
    updateSoundToggleButton();

    // When re-enabling sound, unlock context if needed
    if (audioState.enabled && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
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
