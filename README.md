# 👁️ Voice-Over Vision

Voice-Over Vision transforms YouTube watching for the visually impaired, making every video more accessible and enjoyable. Like a friend whispering in your ear, this Chrome Extension narrates the unseen parts of a video, filling in the blanks where audio alone falls short. It smartly sifts through videos, picking out details that you might miss otherwise, and uses text-to-speech technology to bring those visuals to life through vivid descriptions. With Voice-Over Vision, every story is fully told, ensuring everyone gets the complete picture, no matter what.

<p align="center">
 <a href="#features">Features</a> •
 <a href="#installation">Installation</a> •
 <a href="#usage">Usage</a> • 
 <a href="#license">License</a>
</p>

## Features

- **Real-Time Audio Description**: Generates audio descriptions for YouTube videos, offering a comprehensive viewing experience for visually impaired users.
- **Customizable Speech Parameters**: Adjust voice selection, speech rate, and volume to tailor the audio descriptions to your preferences.
- **Detail Level Settings**: Choose the level of detail for descriptions, from basic overviews to in-depth analysis of physical appearances and emotions.
- **Interruption Frequency Control**: Select how often you'd like the video's original audio to be interrupted with descriptions, ensuring a balanced experience.

## Installation

Instructions on how to install and run Voice-Over Vision (soon to be released at Google Chrome Extensions marketplace)

### Prerequisites

- Google Chrome or any Chromium-based browser.
- Clone of the [back-end repository](https://github.com/guilherme-francisco/winter_hackaton_backend).

### Steps

1. **Clone the repository**: `git clone <repository-url>`.
2. **Run the back-end server**: Navigate to the [back-end repository](https://github.com/guilherme-francisco/winter_hackaton_backend) and follow the instructions to get it running on `localhost:8000`.
3. **Configure the extension**:
   - Navigate to the root directory of the cloned extension.
   - Edit the `config.js` file with your OpenAI API key as follows:
     ```javascript
     const config = {
       openAiApiKey: "YOUR_API_KEY",
     };
     ```
4. **Load the extension in Chrome** (detailed information [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)):
   - Open the _Manage Extensions_ page by navigating to `chrome://extensions/` in your Chrome browser.
   - Enable _Developer mode_ by toggling the switch at the top-right corner.
   - Click on _Load unpacked_ and select the directory of your cloned repository.
   - The extension should now be installed and visible in your Extensions list, you can pin it if you want by clicking the Pin icon.

## Usage

To use Voice-Over Vision, follow these simple steps:

1. Install the extension from the Chrome Web Store and enable it in your browser.
2. Navigate to a YouTube video you wish to watch. Once the video is playing, the extension will automatically start processing the video and audio.
3. The extension icon will light up, indicating that it's active. Click on the icon to open the configuration panel where you can adjust settings according to your preferences.
4. Enjoy your video with real-time audio descriptions. You can toggle the extension on or off for individual videos directly from the youtube video toolbar.

Voice-Over Vision is more than just an extension; it's a companion for exploring the visual world through sound, ensuring that everyone has access to the full richness of video content.

## License

© Voice-Over Vision, 2024. All Rights Reserved.

Unauthorized copying of this project, via any medium, is strictly prohibited. Proprietary and confidential. Usage of this project or its parts for commercial purposes without express permission from the author is prohibited.
