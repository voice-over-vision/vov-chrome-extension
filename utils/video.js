const processVideo = () => {
    if (!document.getElementsByClassName("vov-describe-btn")[0]) {
        createControls();
        createATVChatUI();
        youtubePlayer.addEventListener('volumechange', updateVolume)
    }

    executeAfterAds(youtubePlayer, ()=>{
        youtubePlayer.pause()
        createDescriptionPlayer();
    });

    console.log("Current YouTube Video ID:", youtubeId);
    connectWithBackend(youtubeId);
};

const handleVideoChange = () => {
    console.log('New video detected!');
    initializeStore();
    resetProgressBar();

    processVideo(); // Call your function to handle new video loading
};