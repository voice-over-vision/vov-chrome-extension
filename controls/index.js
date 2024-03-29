const updateButtonIcon = () => {
    const eyeLine = document.querySelector('.vov-describe-btn .vov-eye-line'); // Access the line within the button
    if (eyeLine) {
        eyeLine.style.opacity = descriptionEnabled ? '0' : '1'; // Change opacity based on descriptionEnabled
    }
};

const playAudioDuringVideo = (audioToPlay) => {

    const wasPlaying = !youtubePlayer.paused;

    // Pause the YouTube video if it was playing
    if (wasPlaying) {
        youtubePlayer.pause();
    }
    // Play the selected audio
    audioToPlay.play();

    // Wait for the audio to finish playing
    audioToPlay.onended = () => {
        // Resume video playback only if the video was playing before
        if (wasPlaying) {
            youtubePlayer.play();
        }
    };
}

const changeDescriptionState = () => {
    descriptionEnabled = !descriptionEnabled;

    // Determine which audio to play based on the description state
    const audioToPlay = descriptionEnabled ? descriptionOnAudio : descriptionOffAudio;

    playAudioDuringVideo(audioToPlay);

    console.log("Description button clicked! Description state is now:", descriptionEnabled);
    updateButtonIcon();
};

const toggleChatUI = () => {
    const chatContainer = document.getElementById("vov-chat-container");
    const chatInput = document.getElementById("vov-chat-input");
    console.log("Toggling chat UI visibility...")
    if (chatContainer.style.display === "none") {
        chatContainer.style.display = "flex";
        youtubePlayer.pause();
        askTheVideoAudio.play();
        chatInput.focus();
    } else {
        chatContainer.style.display = "none";
        youtubePlayer.play();
    }
};

const createControls = () => {
    const describeBtn = document.createElement("div");
    describeBtn.className = "ytp-button vov-describe-btn";
    describeBtn.style = "width: 48px; height: 48px; overflow: visible; transition: opacity 500ms ease-in-out; cursor: pointer;";
    describeBtn.title = "Enable description with the Voice-Over!";
    describeBtn.tabIndex = 0;
    describeBtn.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38.7523 23.3557C31.3479 14.0021 16.7112 13.8638 9.24162 23.3583C8.73282 24.005 8.73282 24.9137 9.24162 25.5605C16.7112 35.055 31.3479 34.9167 38.7523 25.5631C39.2648 24.9156 39.2648 24.0031 38.7523 23.3557Z" stroke="white" stroke-width="2.01212"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0314 30.2441C27.3652 30.2441 30.0678 27.6541 30.0678 24.4592C30.0678 21.2643 27.3652 18.6744 24.0314 18.6744C20.6976 18.6744 17.9951 21.2643 17.9951 24.4592C17.9951 27.6541 20.6976 30.2441 24.0314 30.2441ZM25.6303 24.4592C26.6126 24.4592 27.4089 23.6629 27.4089 22.6807C27.4089 21.6984 26.6126 20.9021 25.6303 20.9021C24.6481 20.9021 23.8518 21.6984 23.8518 22.6807C23.8518 23.6629 24.6481 24.4592 25.6303 24.4592Z" fill="white"/>
            <rect class="vov-eye-line" style="transition: opacity 100ms ease-in-out; opacity:0;" x="11.9946" y="33.6491" width="31.4419" height="4.15" rx="1.18571" transform="rotate(-45 11.9946 33.6491)" fill="white"/>
        </svg>
    `;

    const questionBtn = document.createElement("div"); // Changed from "img" to "div"
    questionBtn.className = "ytp-button vov-question-btn";
    questionBtn.title = "Ask a question to the video with Voice-Over!";
    questionBtn.tabIndex = 0;
    questionBtn.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.8956 25.8499C22.2444 25.8499 22.579 25.9885 22.8256 26.2351C23.0723 26.4818 23.2108 26.8163 23.2108 27.1651C23.2108 27.514 23.0723 27.8485 22.8256 28.0952C22.579 28.3418 22.2444 28.4804 21.8956 28.4804C21.5468 28.4804 21.2122 28.3418 20.9656 28.0952C20.7189 27.8485 20.5803 27.514 20.5803 27.1651C20.5803 26.8163 20.7189 26.4818 20.9656 26.2351C21.2122 25.9885 21.5468 25.8499 21.8956 25.8499ZM21.8956 15.5867C24.0652 15.5867 25.7951 17.367 25.7951 19.6903C25.7951 20.9235 25.3447 21.6011 24.2652 22.4639L23.6822 22.9163C23.1645 23.3246 22.9899 23.5477 22.9541 23.8591L22.931 24.1874C22.8841 24.4461 22.7421 24.678 22.5329 24.8372C22.3236 24.9965 22.0624 25.0716 21.8005 25.0478C21.5387 25.0241 21.2952 24.9031 21.118 24.7088C20.9409 24.5145 20.8429 24.2609 20.8434 23.998C20.8434 22.7985 21.2853 22.1377 22.3501 21.2875L22.9352 20.8351C23.5412 20.3511 23.6928 20.1154 23.6928 19.6903C23.6928 18.516 22.8889 17.6911 21.8956 17.6911C20.856 17.6911 20.0879 18.4613 20.1005 19.6798C20.1033 19.9588 19.9951 20.2276 19.7998 20.4269C19.7031 20.5255 19.5878 20.6042 19.4607 20.6584C19.3336 20.7125 19.197 20.7411 19.0588 20.7425C18.7798 20.7453 18.511 20.6371 18.3117 20.4417C18.1124 20.2464 17.9989 19.9799 17.9961 19.7008C17.973 17.306 19.6902 15.5867 21.8956 15.5867ZM11.3735 21.8936C11.3744 19.6167 12.1138 17.4015 13.4808 15.5806C14.8477 13.7597 16.7684 12.4313 18.9546 11.7949C21.1407 11.1585 23.4743 11.2484 25.605 12.0511C27.7358 12.8538 29.5486 14.326 30.7714 16.2466C31.9942 18.1673 32.5611 20.4328 32.3868 22.703C32.2125 24.9732 31.3065 27.1257 29.8048 28.8372C28.3031 30.5487 26.2868 31.7269 24.0585 32.1949C21.8302 32.6629 19.5102 32.3956 17.4469 31.4329L12.632 32.3946C12.4622 32.4284 12.2868 32.4198 12.1212 32.3696C11.9556 32.3193 11.8049 32.229 11.6825 32.1067C11.5601 31.9843 11.4698 31.8336 11.4196 31.668C11.3694 31.5024 11.3608 31.3269 11.3946 31.1572L12.3563 26.3402C11.7069 24.9479 11.3714 23.4299 11.3735 21.8936ZM21.8956 13.476C20.4547 13.4756 19.0379 13.8451 17.7808 14.5491C16.5236 15.253 15.4682 16.2679 14.7155 17.4965C13.9629 18.7252 13.5382 20.1264 13.4822 21.5662C13.4261 23.006 13.7406 24.436 14.3955 25.7194C14.5035 25.9309 14.5369 26.1726 14.4902 26.4055L13.7663 30.0229L17.3837 29.299C17.6165 29.2523 17.8583 29.2856 18.0698 29.3937C19.2035 29.9714 20.4534 30.2845 21.7255 30.3096C22.9977 30.3347 24.2589 30.071 25.4145 29.5385C26.5701 29.006 27.5899 28.2184 28.3973 27.235C29.2047 26.2516 29.7786 25.0979 30.076 23.8607C30.3733 22.6236 30.3863 21.3351 30.114 20.0922C29.8417 18.8493 29.2912 17.6843 28.5039 16.6848C27.7165 15.6853 26.7128 14.8772 25.5682 14.3214C24.4237 13.7657 23.168 13.4766 21.8956 13.476ZM19.4966 34.2928C21.3664 35.8052 23.6995 36.6284 26.1044 36.6245C27.6911 36.6245 29.1979 36.273 30.551 35.6417L35.368 36.6034C35.5378 36.6372 35.7132 36.6286 35.8788 36.5784C36.0444 36.5282 36.1951 36.4379 36.3175 36.3155C36.4399 36.1931 36.5302 36.0424 36.5804 35.8768C36.6306 35.7112 36.6392 35.5358 36.6054 35.366L35.6437 30.5511C36.275 29.198 36.6265 27.6891 36.6265 26.1024C36.6299 23.6982 35.8067 21.366 34.2948 19.4967C34.5946 21.0546 34.5996 22.655 34.3095 24.2148C34.7507 26.1431 34.5013 28.165 33.6045 29.9282C33.4965 30.1397 33.4631 30.3815 33.5098 30.6143L34.2337 34.2318L30.6142 33.5078C30.382 33.4616 30.1411 33.4949 29.9302 33.6025C28.1667 34.5006 26.1436 34.7502 24.2147 34.3075C22.6549 34.5975 21.0545 34.5925 19.4966 34.2928Z" fill="white"/>
        </svg>            
    `;

    youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];
    youtubeRightControls.insertBefore(questionBtn, youtubeRightControls.firstChild);
    youtubeRightControls.insertBefore(describeBtn, youtubeRightControls.firstChild);

    describeBtn.addEventListener("click", changeDescriptionState);
    describeBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            e.preventDefault();
            describeBtn.click();
        }
    });

    questionBtn.addEventListener("click", () => {
        toggleChatUI();
    });

    // Shortcut to toggle the description feature
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            changeDescriptionState();
        }
    });
    
    // Shortcut to toggle the description feature
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === 'q' || e.key === 'Q')) {
            e.preventDefault();
            toggleChatUI();
        }
    });
}