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

    // Initialize an array of preloadedAudios with nulls
    let preloadedAudios = new Array(descriptionDataToPlay.data.length).fill(null);
    let preloadedAudiosStatus = new Array(descriptionDataToPlay.data.length).fill(null);

    // Pre-loads the audio buffer for a specific index
    const preloadDescriptionAudio = (index, description) => {
        if (preloadedAudios[index]) return; // If already preloaded, do nothing

        const openAiApiKey = config.openAiApiKey;
        const apiUrl = 'https://api.openai.com/v1/audio/speech';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: "tts-1",
                voice: "alloy",
                input: description,
            })
        })
            .then(response => response.ok ? response.arrayBuffer() : Promise.reject('Network response was not ok.'))
            .then(arrayBuffer => {
                preloadedAudios[index] = arrayBuffer; // Store preloaded audio at the correct index
            })
            .catch(error => console.error('Error:', error));
    };

    const loadDescriptionDataToPlay = (youtubeID) => {
        const apiUrl = `http://127.0.0.1:8000/get_audio_description/?youtubeID=${youtubeID}`;

        fetch(apiUrl)
            .then(async response => {
                data = (await response.json())['data'];
                console.log(data);
                if (response.ok) {
                    descriptionDataToPlay = { 'data': data };
                    console.log(descriptionDataToPlay)
                } else {
                    console.log('Network response was not ok.');
                }
            })
            .catch(error => console.error('Error:', error));
    };


    // Adjusted interval logic to preload and play description audio
    const startLoggingVideoTime = () => {
        if (intervalId !== null) clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (youtubePlayer) {
                if (descriptionState) {
                    const currentTime = youtubePlayer.currentTime;
                    console.log("Current video time:", currentTime);
                    descriptionDataToPlay.data.forEach((item, index) => {
                        if (currentTime >= item.start_timestamp - 10 && currentTime < item.start_timestamp && !preloadedAudios[index] && preloadedAudiosStatus[index] !== "preloading") {
                            console.log("Preloading audio for timestamp: ", item.start_timestamp);
                            preloadDescriptionAudio(index, item.description);
                            preloadedAudiosStatus[index] = "preloading"; // Update preloaded audio status
                        }

                        if (preloadedAudios[index] && currentTime >= item.start_timestamp && lastVideoTime < item.start_timestamp) {
                            console.log("Playing preloaded audio now");
                            youtubePlayer.pause();
                            playAudio(preloadedAudios[index], () => {
                                console.log("Audio finished playing. Resuming video playback...");
                                youtubePlayer.play();
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


    // Fetches and plays the description audio
    const playDescriptionAudio = (description) => {
        const openAiApiKey = config.openAiApiKey;
        const apiUrl = 'https://api.openai.com/v1/audio/speech';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: "tts-1",
                voice: "alloy",
                input: description,
            })
        })
            .then(response => response.ok ? response.arrayBuffer() : Promise.reject('Network response was not ok.'))
            .then(arrayBuffer => playAudio(arrayBuffer, () => {
                // Resume video playback after the audio finishes
                console.log("Audio finished playing. Resuming video playback...");
                youtubePlayer.play();
            }))
            .catch(error => console.error('Error:', error));
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
            loadDescriptionDataToPlay(videoId);
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
