const processVideo = () => {
    if (!document.getElementsByClassName("vov-describe-btn")[0]) {
        createControls();
        createATVChatUI();
        youtubePlayer = getYoutubePlayer();
        youtubePlayer.addEventListener('volumechange', updateVolume)
    }

    executeAfterAds(youtubePlayer, ()=>{
        youtubePlayer.pause()
        createDescriptionPlayer();
    });

    const videoId = getYouTubeVideoId();
    console.log("Current YouTube Video ID:", videoId);
    connectWithBackend(videoId);
};

const handleVideoChange = () => {
    console.log('New video detected!');
    initializeStore();

    executeAfterAds(youtubePlayer, ()=>{
        const elements = document.querySelectorAll('[class^="ytp-load-progress pauseMoment-"], [class*=" ytp-load-progress pauseMoment-"]');
        elements.forEach(el => el.parentNode.removeChild(el));
    })

    processVideo(); // Call your function to handle new video loading
};