const createDescriptionMarker = (time, index, hasDescription = false) => {
    const youtubeProgressList = document.getElementsByClassName("ytp-progress-list")[0];
    const progressBarWidth = youtubeProgressList.offsetWidth;

    // Get the duration of the video from the YouTube player
    const videoDuration = youtubePlayer.duration;

    // Calculate time per pixel
    const timePerPixel = videoDuration / progressBarWidth;

    // Calculate position of marker based on time per pixel
    const markerPosition = time / timePerPixel;

    const pauseMomentBar = document.createElement("div");
    pauseMomentBar.className = `ytp-load-progress vov-description-marker vov-pause-moment-${index}`;
    pauseMomentBar.style = `left: ${markerPosition}px; background: ${hasDescription ? "#ffff00": "rgba(255, 216, 5, 0.86)"}; transform: scaleX(0.008);`;
    youtubeProgressList.appendChild(pauseMomentBar);
}

const resetProgressBar = () => {
    let descriptionMarkers = document.querySelectorAll('.vov-description-marker');
    descriptionMarkers.forEach(marker => {
        if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
        }
    });
}