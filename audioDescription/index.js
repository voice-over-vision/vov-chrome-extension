const createDescriptionPlayer = () => {
    if (descriptionCheckInterval !== null) clearInterval(descriptionCheckInterval);
    intervalTime = 50 //ms
    youtubePlayer = getYoutubePlayer();

    descriptionCheckInterval = setInterval(() => {
        if (youtubePlayer) {
            const currentTime = youtubePlayer.currentTime;

            if (descriptionEnabled) {
                descriptionDataToPlay.data.forEach((item, _) => {
                    if (currentTime >= item.start_timestamp && lastVideoTime < item.start_timestamp) {
                        console.log("Playing audio now");
                        currentVolume = youtubePlayer.volume;

                        if (item['action'] == 'play') {
                            youtubePlayer.playbackRate = item['video_speed']
                            force_volume_down = true;
                            youtubePlayer.volume = 0;
                        } else youtubePlayer.pause();

                        playAudio(item['audio_description'], () => {
                            console.log("Audio finished playing. Resuming video playback...");
                            youtubePlayer.play();
                            if (item['action'] == 'play') {
                                youtubePlayer.playbackRate = 1
                                youtubePlayer.volume = currentVolume;
                            }
                        });

                    }
                });
            }
            lastVideoTime = currentTime;
        } else {
            console.log("YouTube player not found.");
        }
    }, intervalTime);
};

const updateVolume = () => {
    youtubePlayer = getYoutubePlayer();
    if(force_volume_down) {
        force_volume_down = false;
        return;
    }
    const currentVolume = youtubePlayer.muted ? 0 : youtubePlayer.volume;
    askTheVideoAudio.volume = currentVolume;
    descriptionOnAudio.volume = currentVolume;
    descriptionOffAudio.volume = currentVolume;
    // Update the gainNode's volume
    if (gainNode) gainNode.gain.value = currentVolume;
};

const newVideoLoaded = () => {
    if (!document.getElementsByClassName("vov-describe-btn")[0]) {
        youtubePlayer = document.getElementsByClassName("video-stream")[0];
        youtubePlayer.addEventListener('volumechange', updateVolume)
        createControls();

    }
    executeAfterAds(youtubePlayer, ()=>{
        youtubePlayer.pause()
        createDescriptionPlayer();
    });
    const videoId = getYouTubeVideoId();
    console.log("Current YouTube Video ID:", videoId);
    connectWithBackend(videoId);
};

// Shortcut to toggle the description feature
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        changeDescriptionState();
    }
});

// Shortcut to toggle the description feature
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        toggleChatUI();
    }
});