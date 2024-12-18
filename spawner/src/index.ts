import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

async function openMeet(driver: WebDriver) {
  try {
    await driver.get("https://meet.google.com/ybi-eurv-efr");

    const nameInput = await driver.wait(
      until.elementLocated(By.xpath('//input[@placeholder="Your name"]')),
      10000
    );
    await nameInput.sendKeys("value", "Meeting bot");
    await driver.sleep(1000);
    const buttonInput = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')),
      10000
    );
    buttonInput.click();
  } finally {
  }
}

async function getDriver() {
  const options = new Options({});
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--use-fake-ui-for-media-stream");
  options.addArguments("--window-size=1080,720");
  options.addArguments("--auto-select-desktop-capture-source=[RECORD]");
  options.addArguments("--auto-select-desktop-capture-source=[RECORD]");
  options.addArguments("--enable-usermedia-screen-capturing");
  options.addArguments('--auto-select-tab-capture-source-by-title="Meet"');
  options.addArguments("--allow-running-insecure-content");

  // ​​--allow-file-access-from-files--use-fake-device-for-media-stream--allow-running-insecure-content--allow-file-access-from-files--use-fake-device-for-media-stream--allow-running-insecure-content

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
  return driver;
}

async function startScreenshare(driver: WebDriver) {
  console.log("startScreensharecalled");
  await driver.executeScript(`
    console.log("script execution starting")
    const videoProfile = "profile-level-id=6400";
const ipAddress = "127.0.0.1";
const useSingleWebRTCPort = true;
function setCodec(sdp, type, codec, clockRate) {
  var sdpLines = sdp.split("\r\n");

  for (var i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search("m=" + type) !== -1) {
      var mLineIndex = i;
      break;
    }
  }

  if (mLineIndex === null) return sdp;

  var codecPayload = null;
  var re = new RegExp(":(\\d+) " + codec + "/" + clockRate);
  function extractPayloadType(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length == 2 ? result[1] : null;
  }
  for (var i = mLineIndex; i < sdpLines.length; i++) {
    if (sdpLines[i].search(codec + "/" + clockRate) !== -1) {
      codecPayload = extractPayloadType(sdpLines[i], re);
      if (
        codecPayload &&
        CodecProfileMatches(codec, sdpLines, mLineIndex, codecPayload)
      ) {
        sdpLines[mLineIndex] = setDefaultCodec(
          sdpLines[mLineIndex],
          codecPayload
        );
        break;
      }
    }
  }

  if (codecPayload === null) return sdp;

  var rtmpmap = "a=rtpmap:";
  var rtcp = "a=rtcp-fb:";
  var fmptp = "a=fmtp:";
  var rtmpmapThis = "a=rtpmap:" + codecPayload;
  var rtcpThis = "a=rtcp-fb:" + codecPayload;
  var fmptpThis = "a=fmtp:" + codecPayload;
  var bAddAll = false;
  var resSDPLines = new Array();

  for (var i = 0; i < sdpLines.length; i++) {
    if (i <= mLineIndex) {
      resSDPLines.push(sdpLines[i]);
    } else {
      if (sdpLines[i].search("m=") === 0) bAddAll = true;

      var bNotToAdd =
        (sdpLines[i].search(rtmpmap) === 0 &&
          sdpLines[i].search(rtmpmapThis) !== 0) ||
        (sdpLines[i].search(rtcp) === 0 &&
          sdpLines[i].search(rtcpThis) !== 0) ||
        (sdpLines[i].search(fmptp) === 0 &&
          sdpLines[i].search(fmptpThis) !== 0);

      if (bAddAll || !bNotToAdd) resSDPLines.push(sdpLines[i]);
    }
  }

  sdp = resSDPLines.join("\r\n");
  return sdp;
}
function CodecProfileMatches(codec, sdpLines, mLineIndex, codecPayload) {
  if (codec != "H264") return true;

  for (var i = mLineIndex; i < sdpLines.length; i++) {
    if (
      sdpLines[i].search("a=fmtp:" + codecPayload) === 0 &&
      sdpLines[i].search(videoProfile) !== -1
    )
      return true;
  }

  return false;
}
function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(" ");
  var newLine = new Array();
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) {
      newLine[index++] = payload;
      break;
    }
    if (elements[i] !== payload) newLine[index++] = elements[i];
  }
  return newLine.join(" ");
}
function setMediaBitrates(sdp) {
  sdp = setMediaBitrate(sdp, "video", 1000);

  sdp = setMediaBitrate(sdp, "audio", 50);

  return sdp;
}
function setMediaBitrate(sdp, media, bitrate) {
  var modifier = "b=AS:";

  var lines = sdp.split("\r\n");
  var line = -1;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("m=" + media) === 0) {
      line = i;
      break;
    }
  }

  if (line === -1) return sdp;

  // Pass the m line
  line++;

  // Skip i and c lines
  while (lines[line].indexOf("i=") === 0 || lines[line].indexOf("c=") === 0)
    line++;

  // If we are on a b line, replace it
  if (lines[line].indexOf("b") === 0) {
    lines[line] = modifier + bitrate;
    return lines.join("\r\n");
  }

  // Add a new b line
  var newLines = lines.slice(0, line);
  newLines.push(modifier + bitrate);
  newLines = newLines.concat(lines.slice(line, lines.length));
  return newLines.join("\r\n");
}
const modifyOffer = (offer) => {
  offer.sdp = setMediaBitrates(offer.sdp);
  offer.sdp = setCodec(offer.sdp, "audio", "opus", 48000);
  offer.sdp = setCodec(offer.sdp, "video", "H264", 90000);

  offer.sdp = offer.sdp.replace("a=sendrecv", "a=sendonly");
  offer.sdp = offer.sdp.replace("a=sendrecv", "a=sendonly");

  //Fix for a=extmap-allow-mixed - Unreal Media Server doesn't support it in SDP
  offer.sdp = offer.sdp.replace("a=extmap-allow-mixed\r\n", "");
  offer.sdp = offer.sdp.replace("a=extmap-allow-mixed", "");
  return offer;
};

// Helper function for delays
function wait(delayInMS) {
  return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

// Set up WebSocket signaling
const socket = new WebSocket(
  "ws://127.0.0.1:5119/webrtc_publish/singleport/tcp/webrtctest"
);
console.log(socket);
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

// Add event listener for ICE candidates
peerConnection.onicecandidate = (event) => {
  // if (event.candidate) {
  //   socket.send(JSON.stringify(event));
  // }
};

// Handle incoming WebSocket messages
socket.onmessage = async (event) => {
  var response = event.data;
  var strArr = response.split("|-|-|");
  if (strArr.length == 1) {
    stop();
    alert(response);
  } else {
    var serverSDP = JSON.parse(strArr[0]);
    var serverEndpoint = JSON.parse(strArr[1]);

    serverEndpoint.candidate = EnsureValidCandidate(serverEndpoint.candidate);

    serverSDP.sdp = setMediaBitrates(serverSDP.sdp);

    peerConnection.setRemoteDescription(new RTCSessionDescription(serverSDP));
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: serverEndpoint.sdpMLineIndex,
      candidate: serverEndpoint.candidate,
    });
    peerConnection.addIceCandidate(candidate);
  }

  if (socket != null) {
    socket.close();
  }
  function EnsureValidCandidate(candidate) {
    if (
      candidate.search(ipAddress) !== -1 ||
      !useSingleWebRTCPort ||
      ipAddress == "127.0.0.1" ||
      !ValidateIPaddress(ipAddress)
    ) {
      return candidate;
    }

    //In case the server is behind the NAT router, replace private IP with public IP in the candidate
    var candLines = candidate.split(" ");
    var ipIndex = 4;
    for (var i = 0; i < candLines.length; i++) {
      if (candLines[i] === "typ") {
        ipIndex = i - 2;
        break;
      }
    }

    candLines[ipIndex] = ipAddress;
    candidate = candLines.join(" ");
    return candidate;
  }

  function ValidateIPaddress(ipaddr) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddr
      )
    ) {
      return true;
    }

    return false;
  }
  // const message = JSON.parse(event.data);
  // if (message.type === "answer") {
  //   const remoteDesc = new RTCSessionDescription(message);
  //   await peerConnection.setRemoteDescription(remoteDesc);
  // } else if (message.type === "ice-candidate") {
  //   try {
  //     await peerConnection.addIceCandidate(message.candidate);
  //   } catch (e) {
  //     console.error("Error adding received ICE candidate", e);
  //   }
  // }
};

console.log("before mediadevices");
window.navigator.mediaDevices
  .getDisplayMedia({
    video: {
      displaySurface: "browser", // Capture browser window
    },
    audio: true,
    preferCurrentTab: true,
  })
  .then(async (screenStream) => {
    const audioContext = new AudioContext();
    const screenAudioStream =
      audioContext.createMediaStreamSource(screenStream);
    const audioEl1 = document.querySelectorAll("audio")[0];
    const audioEl2 = document.querySelectorAll("audio")[1];
    const audioEl3 = document.querySelectorAll("audio")[2];
    const audioElStream1 = audioContext.createMediaStreamSource(
      audioEl1.srcObject
    );
    const audioElStream2 = audioContext.createMediaStreamSource(
      audioEl3.srcObject
    );
    const audioElStream3 = audioContext.createMediaStreamSource(
      audioEl2.srcObject
    );

    const dest = audioContext.createMediaStreamDestination();

    screenAudioStream.connect(dest);
    audioElStream1.connect(dest);
    audioElStream2.connect(dest);
    audioElStream3.connect(dest);
    // Combine screen and audio streams
    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);
    // peerConnection.addStream(screenStream);
    combinedStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, combinedStream);
    });
    // Create and send an SDP offer
    let offer = await peerConnection.createOffer();
    offer = modifyOffer(offer);
    await peerConnection.setLocalDescription(offer);
    console.log("12345|-|-|" + JSON.stringify(peerConnection.localDescription));
    socket.send("12345|-|-|" + JSON.stringify(peerConnection.localDescription));
  });
  console.log("Screen sharing setup complete.");
    `);
  driver.sleep(1000000);
}

async function main() {
  const driver = await getDriver();
  await openMeet(driver);
  await new Promise((x) => setTimeout(x, 1000));
  // wait until admin lets u join
  await startScreenshare(driver);
}
main();
