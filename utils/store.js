//informative audios
const askTheVideoAudio = new Audio(chrome.runtime.getURL("assets/ask_the_video.mp3"));
const errorAudio = new Audio(chrome.runtime.getURL("assets/ask_the_video.mp3"));
const descriptionOnAudio = new Audio(chrome.runtime.getURL("assets/on.mp3"));
const descriptionOffAudio = new Audio(chrome.runtime.getURL("assets/off.mp3"));

// Global audio context to reuse it efficiently
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = audioContext.createGain();

var descriptionEnabled = true;

const initializeStore = () => {
    let urlParams = new URLSearchParams(window.location.search);
    var youtubeId = urlParams.get('v');
    var youtubePlayer = document.getElementsByClassName("video-stream")[0];
    var descriptionDataToPlay = { 'data': [] };
    var force_volume_down = false
    var videoUrl = location.href;
    var lastVideoTime = -1;

    console.log("Store initialized")
}