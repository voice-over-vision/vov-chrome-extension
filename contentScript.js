// Self-invoking function to encapsulate the logic
(() => {    
    // Initialize the feature when a new video is loaded
    initializeStore();
    processVideo();
    createVideoChangeDetector();
})();
