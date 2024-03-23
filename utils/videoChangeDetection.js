
const createVideoChangeDetector = () =>{
    // Function to monitor URL changes by polling
    // Preserve the original pushState and replaceState functions
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Override pushState to listen for changes
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        handleVideoChange(); // Detected a navigation change
    };
    
    // Override replaceState to listen for changes
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        handleVideoChange(); // Detected a navigation change
    };
    
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== videoUrl) {
            videoUrl = currentUrl; // Update the last known URL
            handleVideoChange(); // Detected a URL change by polling
        }
    }, 1000); // Check every 1 second
}