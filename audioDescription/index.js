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