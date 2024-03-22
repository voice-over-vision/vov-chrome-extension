const createDescriptionPlayer = () => {
    if (descriptionCheckInterval !== null) clearInterval(descriptionCheckInterval);
    intervalTime = 50 //ms
    youtubePlayer = getYoutubePlayer();

    descriptionCheckInterval = setInterval(() => {
        if (youtubePlayer) {
            if (descriptionEnabled) {
                const currentTime = youtubePlayer.currentTime;
                descriptionDataToPlay.data.forEach((item, _) => {
                    if (currentTime >= item.start_timestamp >= (currentTime - intervalTime/1000)) {
                        // console.log("Playing audio now");

                        // if (item['action'] == 'play') {
                        //     youtubePlayer.playbackRate = item['video_speed']
                        //     current_volume = youtubePlayer.volume;
                        //     force_volume_down = true;
                        //     youtubePlayer.volume = 0;
                        // } else youtubePlayer.pause();

                        // playAudio(item['audio_description'], () => {
                        //     console.log("Audio finished playing. Resuming video playback...");
                        //     youtubePlayer.play();
                        //     if (item['action'] == 'play') {
                        //         youtubePlayer.playbackRate = 1
                        //         youtubePlayer.volume = currentVolume;
                        //     }
                        // });

                    }
                });
            }
        } else {
            console.log("YouTube player not found.");
        }
    }, intervalTime);
};