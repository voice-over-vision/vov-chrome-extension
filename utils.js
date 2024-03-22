const askTheVideoAudio = new Audio(chrome.runtime.getURL("assets/ask_the_video.mp3"));
const errorAudio = new Audio(chrome.runtime.getURL("assets/ask_the_video.mp3"));
const descriptionOnAudio = new Audio(chrome.runtime.getURL("assets/on.mp3"));
const descriptionOffAudio = new Audio(chrome.runtime.getURL("assets/off.mp3"));

const EventTypes = {
    INITIAL_MESSAGE: "INITIAL_MESSAGE",
    PAUSE_MOMENTS: "PAUSE_MOMENTS",
    AUDIO_DESCRIPTION: "AUDIO_DESCRIPTION"
}

// DOM references
let youtubeLeftControls, youtubePlayer;

// State variables
let descriptionCheckInterval = null;
let descriptionEnabled = true; // Initialize the description state as false
let lastVideoTime = -1; // Add this to track the last played timestamp
let descriptionDataToPlay = { 'data': [] };
let force_volume_down = false

// Global audio context to reuse it efficiently
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = audioContext.createGain();

const getYouTubeVideoId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
};

const getYoutubePlayer = () => {
    const youtubePlayer = document.getElementsByClassName("video-stream")[0];
    return youtubePlayer
}

const base64StringToArrayBuffer = (base64) => {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const playAudio = (b64Audio, callback) => {
    arrayBuffer = base64StringToArrayBuffer(b64Audio)
    const youtubePlayer = getYoutubePlayer();
    console.log("youtube player muted: ", youtubePlayer.muted)
    if (youtubePlayer.muted) {
        console.log("Player is muted. Skipping audio playback.");
        callback(); // Call the callback immediately to continue the logic without playing sound
        return;
    }

    audioContext.decodeAudioData(arrayBuffer.slice(0), (audioBuffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        // Connect source to gain node instead of directly to destination
        source.connect(gainNode);
        // Connect gain node to audio context destination
        gainNode.connect(audioContext.destination);
        source.start(0);
        source.onended = () => {
            callback(); // Callback after audio finishes playing
        };
    }, (error) => {
        console.error('Error decoding audio data:', error);
    });
};