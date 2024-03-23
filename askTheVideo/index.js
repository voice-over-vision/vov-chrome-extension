responseErrorMessage = "An error has occured, please try again later"

const askTheVideoRequest = async (message) => {
    videoID = getYouTubeVideoId();
    youtubePlayer = getYoutubePlayer();
    const apiUrl = `http://127.0.0.1:8000/ask-the-video?youtubeID=${videoID}&timestamp=${youtubePlayer.currentTime}&question=${message}`;
    try {
        const response = await fetch(apiUrl);

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Request failed with status:', response.status);
            return null;
        }
    } catch (e) {
        console.error('Error fetching data');
        return null;
    }
}

// Function to create chat UI elements
const createATVChatUI = () => {
    // Chat container
    const chatContainer = document.createElement("div");
    chatContainer.id = "vov-chatContainer";

    // Chat UI title
    const chatTitle = document.createElement("div");
    chatTitle.textContent = "Ask the video!";
    chatTitle.id = "vov-chatTitle"
    chatContainer.appendChild(chatTitle);

    // Chat messages display area
    const chatDisplay = document.createElement("div");
    chatDisplay.id = "vov-chatDisplay";
    chatContainer.appendChild(chatDisplay);

    // Input area
    const chatInputContainer = document.createElement("div");
    chatInputContainer.id = "vov-chatInputContainer";

    const chatInput = document.createElement("input");
    chatInput.id = "vov-chatInput";
    chatInput.type = "text";
    chatInput.placeholder = "Type your question here...";
    
    chatInputContainer.appendChild(chatInput);
    chatContainer.appendChild(chatInputContainer);

    // Append the chat container to the player
    const player = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
    if (player) {
        player.appendChild(chatContainer);
    } else {
        console.error("YouTube player not found.");
        return;
    }

    chatInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                // User message (right-aligned)
                const userMessageElement = document.createElement("div");
                userMessageElement.textContent = message;
                userMessageElement.id = "vov-chatUserMessage";
                chatDisplay.appendChild(userMessageElement);    
                chatInput.value = "";
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
                
                response = await askTheVideoRequest(message);
                responseMessage = response ? response['answer'] : responseErrorMessage
                response ? playAudio(response['audio_description'], () => {}) : errorAudio.play()

                const responseMessageElement = document.createElement("div");
                responseMessageElement.textContent = responseMessage;
                responseMessageElement.id = "vov-chatResponseMessage"
                chatDisplay.appendChild(responseMessageElement);
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
            }
        } else if (e.ctrlKey && (e.key === 'q' || e.key === 'Q')) {
            e.preventDefault();
        } else {
            e.stopPropagation();
        }
    }, true);

    chatInput.addEventListener("keyup", (e) => {
        e.stopPropagation();
    }, true);
};