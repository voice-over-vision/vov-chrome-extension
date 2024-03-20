const adCheck = ()=>{
    const ad = document.querySelector('.video-ads')

    if (ad && ad.tagName==="DIV"){
        if (ad.innerHTML.trim()!== ""){
            console.log('Ad playing')
            return true
        } else {
            console.log('No ad playing')
            return false
        }
    } 
    return false   
}

const executeAfterAds = (video, callback) => {

    const handleAdFinish = () => {
        console.log("Ad finished")
        video.removeEventListener('durationchange', handleAdFinish);
        handleVideoPlaying();
    }

    const handleVideoPlaying = () => {
        console.log("Video has started playing.");
        hasAd = adCheck()
        
        if(hasAd){
            video.addEventListener('durationchange', handleAdFinish);
        } else {
            console.log("Executing callback")
            callback()
            video.removeEventListener('playing', handleVideoPlaying);
        }
    }

    const videoPlayingCheck = () => {
    
        if (video && video.currentTime > 0) {
            clearInterval(checkVideoInterval);
            handleVideoPlaying()
        } else if (!video || video.paused) {
            clearInterval(checkVideoInterval);
            video.addEventListener('playing', handleVideoPlaying);
            console.log('Video not playing or not found, stopped checking.');
        }
    }
    let checkVideoInterval = setInterval(videoPlayingCheck, 100);

    setTimeout(() => {
        clearInterval(checkVideoInterval);
        console.log('20s passed, stopped checking.');
    }, 20000);

    videoPlayingCheck();
}