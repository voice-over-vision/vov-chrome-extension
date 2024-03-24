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

const updateVolume = () => {
    if(freezeVovVolume) {
        freezeVovVolume = false;
        return;
    }
    const currentVolume = youtubePlayer.muted ? 0 : youtubePlayer.volume;
    askTheVideoAudio.volume = currentVolume;
    descriptionOnAudio.volume = currentVolume;
    descriptionOffAudio.volume = currentVolume;
    errorAudio.volume = currentVolume;
    if (gainNode) gainNode.gain.value = currentVolume;
};