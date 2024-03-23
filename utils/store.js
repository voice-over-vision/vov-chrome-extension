//informative audios
const askTheVideoAudio = new Audio(chrome.runtime.getURL("assets/ask_the_video.mp3"));
const errorAudio = new Audio(chrome.runtime.getURL("assets/ask_the_video.mp3"));
const descriptionOnAudio = new Audio(chrome.runtime.getURL("assets/on.mp3"));
const descriptionOffAudio = new Audio(chrome.runtime.getURL("assets/off.mp3"));

// Global audio context to reuse it efficiently
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = audioContext.createGain();

var descriptionCheckInterval = null
var descriptionEnabled = true;

let urlParams = new URLSearchParams(window.location.search);
var youtubeId = urlParams.get('v');
var youtubePlayer = document.getElementsByClassName("video-stream")[0];
var descriptionDataToPlay = { 'data': [] };
var freezeVovVolume = false
var videoUrl = location.href;
var lastVideoTime = -1;

const initializeStore = () => {
    urlParams = new URLSearchParams(window.location.search);
    youtubeId = urlParams.get('v');
    youtubePlayer = document.getElementsByClassName("video-stream")[0];
    descriptionDataToPlay = { 'data': [] };
    freezeVovVolume = false
    videoUrl = location.href;
    lastVideoTime = -1;

    console.log("Store initialized")
}