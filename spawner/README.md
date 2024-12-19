# Google Meet Recording Bot

A bot for automating tasks in Google Meet, including joining a meeting and recording WebRTC streams. This project also provides steps to convert WebRTC streams into MPEG2 streams using Unreal Media Server and save them locally using FFmpeg.

## Features

- Automates joining Google Meet sessions.
- Captures WebRTC streams.
- Converts WebRTC streams to MPEG2.
- Saves the converted video locally using FFmpeg.

## Requirements

- Node.js
- Selenium 
- Unreal Media Server
- FFmpeg

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Prithviraj2003/meet-record-bot.git
   cd meet-record-bot
    ``` 
2. Install the required dependencies:

```bash
  npm install
```
## How to Use

1. Run the Bot:

```bash
  npm run dev
```
2. Automated Tasks
- The bot will join the specified Google Meet session.
- send the WebRTC stream as configured to Unreal  Media Server.

## Convert WebRTC Stream to MPEG2 Stream

Follow these steps to convert the WebRTC stream into an MPEG2 stream using Unreal Media Server and save the video locally:

### Step 1: Unreal Media Server Setup
1. [Download](http://umediaserver.net/umediaserver/download.html) and install Unreal Media Server.
2. Configure Unreal Media Server as per the tutorial:
[WebRTC to FFmpeg Guide](http://umediaserver.net/umediaserver/webrtctoffmpeg.htm).
3. Use the following values during configuration:
- Alias: webrtctest
- WebRTC Password: 12345
- Ip address and port for MPEG2 broadcasting : 127.0.0.1:2000
4. Start the Unreal Media Server and ensure it's running correctly.

### Step 2: Save Video Locally with FFmpeg
1. [Download](https://www.ffmpeg.org/download.html) and install FFmpeg on your local machine.
2. Open a terminal and navigate to the directory where you want to store the video.
3. Run the following command to save the video stream locally:
```bash
ffmpeg -i udp://127.0.0.1:2000 -c:v libx264 Desktop\ffmpeg\outputfinal.mp4
```
- Replace Desktop\ffmpeg\outputfinal.mp4 with your desired output file path.

### Step 3: Verify the Video
1. Check the output file at the specified location.
2. Ensure the video plays correctly.

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please open an issue or create a pull request to contribute to this project.