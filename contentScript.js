// Self-invoking function to encapsulate the logic
(() => {
    // DOM references
    let youtubeLeftControls, youtubePlayer;

    // State variables
    let intervalId = null;
    let descriptionState = true; // Initialize the description state as false
    const descriptionOnAudio = new Audio(chrome.runtime.getURL("assets/on.mp3"));
    const descriptionOffAudio = new Audio(chrome.runtime.getURL("assets/off.mp3"));
    let lastVideoTime = -1; // Add this to track the last played timestamp
    let descriptionDataToPlay = { 'data': [] };
    
    const EventTypes =  {
        INITIAL_MESSAGE: "INITIAL_MESSAGE",
        PAUSE_MOMENTS: "PAUSE_MOMENTS",
        AUDIO_DESCRIPTION: "AUDIO_DESCRIPTION"
    }

    const createProgressBar = (time, index, color) => {
        const youtubeProgressList = document.getElementsByClassName("ytp-progress-list")[0];
        const progressBarWidth = youtubeProgressList.offsetWidth;

        // Get the duration of the video from the YouTube player
        const videoDuration = youtubePlayer.duration;
    
        // Calculate time per pixel
        const timePerPixel = videoDuration / progressBarWidth;
    
        // Calculate position of marker based on time per pixel
        const timeToPixel = time / timePerPixel;
    
        const pauseMomentBar = document.createElement("div");
        pauseMomentBar.style = `left: ${timeToPixel}px; background: ${color}; transform: scaleX(0.008);`;
        pauseMomentBar.className = `ytp-load-progress pauseMoment-${index}`;
        youtubeProgressList.appendChild(pauseMomentBar);
    }

    const showPauseMoments = (pauseMoments) => {
        pauseMoments.forEach((pauseMoment, index) => {
            createProgressBar(pauseMoment, index, "rgba(255, 216, 5, 0.86)");
        })
    }

    handleAudioDescriptionEvent = (data) => {
        console.log("Handling audio description event")
        console.log(data)
        descriptionDataToPlay.data.push(data);
        createProgressBar(data['start_timestamp'], data['id'], "#ffff00")
    }

    const connectWithBackend = (youtubeID) => {
        url = "ws://127.0.0.1:8000/";
        webSocket = new WebSocket(url);
        webSocket.onopen = () => {
            webSocket.send(JSON.stringify({ "event": EventTypes.INITIAL_MESSAGE, 
                "youtubeID": youtubeID, 
                "currentTime": youtubePlayer.currentTime }));
        };

        webSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log("Message from WS: ")
            console.log(data)
            const event = data['event'];
            // Handle incoming message
            switch (event) {
                case EventTypes.PAUSE_MOMENTS:
                    showPauseMoments(data['pause_moments']);
                    break;
                case EventTypes.AUDIO_DESCRIPTION:
                    handleAudioDescriptionEvent(data)
            }
        };
        
    }

    const base64StringToArrayBuffer = (base64) => {
        var binaryString = atob(base64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Adjusted interval logic to preload and play description audio
    const startLoggingVideoTime = () => {
        if (intervalId !== null) clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (youtubePlayer) {
                if (descriptionState) {
                    const currentTime = youtubePlayer.currentTime;
                    console.log("Current video time:", currentTime);
                    descriptionDataToPlay.data.forEach((item, _) => {
                        if (currentTime >= item.start_timestamp && lastVideoTime < item.start_timestamp) {
                            console.log("Playing audio now");
                            if(item['action'] == 'play') {
                                youtubePlayer.playbackRate = item['video_speed']
                                youtubePlayer.muted = true
                            } else youtubePlayer.pause();
                        
                            playAudio(base64StringToArrayBuffer(item['audio_description']), () => {
                                console.log("Audio finished playing. Resuming video playback...");
                                youtubePlayer.play();
                                if(item['action'] == 'play'){
                                     youtubePlayer.muted = false
                                     youtubePlayer.playbackRate = 1
                                }
                            });

                        }
                    });

                    lastVideoTime = currentTime; // Update lastPlayedTimestamp
                } else {
                    lastVideoTime = youtubePlayer.currentTime; // Update lastPlayedTimestamp
                }
            } else {
                console.log("YouTube player not found.");
            }
        }, 50);
    };

    // Global audio context to reuse it efficiently
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const playAudio = (arrayBuffer, callback) => {
        // Decode the ArrayBuffer into an AudioBuffer each time before playing
        audioContext.decodeAudioData(arrayBuffer.slice(0), (audioBuffer) => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
            source.onended = () => {
                callback(); // Call the callback function after the audio finishes playing
                // Consider if you need to close or manage the AudioContext lifecycle here
            };
        }, (error) => {
            console.error('Error decoding audio data:', error);
        });
    };


    const updateButtonIcon = () => {
        const eyeLine = document.querySelector('.describe-btn .vov-eye-line'); // Access the line within the button
        if (eyeLine) {
            eyeLine.style.opacity = descriptionState ? '0' : '1'; // Change opacity based on descriptionState
        }
    };

    // Retrieves the current YouTube video ID from the URL
    const getYouTubeVideoId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
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

    // Toggles the description state and updates the UI accordingly
    const changeDescriptionState = () => {
        descriptionState = !descriptionState;

        // Determine which audio to play based on the description state
        const audioToPlay = descriptionState ? descriptionOnAudio : descriptionOffAudio;

        playAudioDuringVideo(audioToPlay);

        console.log("Description button clicked! Description state is now:", descriptionState);
        updateButtonIcon();
    };

    const newVideoLoaded = () => {
        if (!document.getElementsByClassName("describe-btn")[0]) {
            const describeBtn = document.createElement("div"); // Changed from "img" to "div"
            describeBtn.className = "ytp-button describe-btn";
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

            youtubeLeftControls = document.getElementsByClassName("ytp-right-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            youtubeLeftControls.insertBefore(describeBtn, youtubeLeftControls.firstChild);

            describeBtn.addEventListener("click", changeDescriptionState);
            describeBtn.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                    e.preventDefault();
                    describeBtn.click();
                }
            });

            startLoggingVideoTime();
            youtubePlayer.pause()
            const videoId = getYouTubeVideoId();
            console.log("Current YouTube Video ID:", videoId);
            connectWithBackend(videoId);
        }
    };
    // Shortcut to toggle the description feature
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            changeDescriptionState();
        }
    });

    // Initialize the feature when a new video is loaded
    newVideoLoaded();
})();
