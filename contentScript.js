// Self-invoking function to encapsulate the logic
(() => {
    // Preserve the original pushState and replaceState functions
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // This function is called whenever a new video page is detected
    const onNewVideo = () => {
        console.log('New video detected!');
        lastVideoTime = -1;
        descriptionDataToPlay = { 'data': [] };

        executeAfterAds(video, ()=>{
            const elements = document.querySelectorAll('[class^="ytp-load-progress pauseMoment-"], [class*=" ytp-load-progress pauseMoment-"]');
            elements.forEach(el => el.parentNode.removeChild(el));
        })

        newVideoLoaded(); // Call your function to handle new video loading
    };

    // Override pushState to listen for changes
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        onNewVideo(); // Detected a navigation change
    };

    // Override replaceState to listen for changes
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        onNewVideo(); // Detected a navigation change
    };

    // Function to monitor URL changes by polling
    let lastUrl = location.href; // Store the current URL
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl; // Update the last known URL
            onNewVideo(); // Detected a URL change by polling
        }
    }, 1000); // Check every 1 second

    // Initialize the feature when a new video is loaded
    newVideoLoaded();
    createChatUI();
})();
