const addCheck = ()=>{
    const ad = document.querySelector('.video-ads')

    if (ad.tagName==="DIV"){
        if (ad.innerHTML.trim()!== ""){
            console.log('Ad playing')
            return true
        } else {
            console.log('No ad playing')
            return false
        }
    }    
}

const executeAfterAds = (video, callback) => {

    const handleAdFinish = () => {
        console.log("Ad finished")
        video.removeEventListener('durationchange', handleAdFinish);
        handleVideoPlaying();
    }

    const handleVideoPlaying = () => {
        console.log("Video has started playing.");
        hasAd = addCheck()
        
        if(hasAd){
            video.addEventListener('durationchange', handleAdFinish);
        } else {
            console.log("Executing callback")
            callback()
            video.removeEventListener('playing', handleVideoPlaying);
        }
    }

    video.addEventListener('playing', handleVideoPlaying);
}