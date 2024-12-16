import { Builder, Browser, By, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'

async function openMeet(driver: WebDriver) {
  
  try {
    await driver.get('https://www.youtube.com/watch?v=XTp5jaRU3Ws&list=RDXTp5jaRU3Ws&start_radio=1');
    // ​​const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')), 10000);
    // await popupButton.click()
    // ​​const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
    // await nameInput.clear();
    // await nameInput.click();
    // await nameInput.sendKeys('value', "Meeting bot");`
    await driver.sleep(1000)
    // ​​const buttonInput = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
    // buttonInput.click();
    
  } finally {
    // await driver.quit()
  }
}

async function getDriver() {
    const options = new Options({})
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--use-fake-ui-for-media-stream");
    options.addArguments("--window-size=1080,720")
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--enable-usermedia-screen-capturing');
    options.addArguments('--auto-select-tab-capture-source-by-title="Meet"')
    
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    return driver;
}

async function startScreenshare(driver: WebDriver) {
    console.log("startScreensharecalled")
    const response = await driver.executeScript(`

        function wait(delayInMS) {
            return new Promise((resolve) => setTimeout(resolve, delayInMS));
        }

        function startRecording(stream, lengthInMS) {
            let recorder = new MediaRecorder(stream);
            let data = [];
            
            recorder.ondataavailable = (event) => data.push(event.data);
            recorder.start();
            
            let stopped = new Promise((resolve, reject) => {
                recorder.onstop = resolve;
                recorder.onerror = (event) => reject(event.name);
            });
            
            let recorded = wait(lengthInMS).then(() => {
                if (recorder.state === "recording") {
                recorder.stop();
                }
            });
            
            return Promise.all([stopped, recorded]).then(() => data);
        }
      
        console.log("before mediadevices")
        window.navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "browser"
            },
            audio: true,
            preferCurrentTab: true
        }).then(async stream => {
            // stream should be streamed via WebRTC to a server
            console.log("before start recording")
            const recordedChunks = await startRecording(stream, 20000);
            console.log("after start recording")
            let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
            const recording = document.createElement("video");
            recording.src = URL.createObjectURL(recordedBlob);
            const downloadButton = document.createElement("a");
            downloadButton.href = recording.src;
            downloadButton.download = "RecordedVideo.webm";    
            downloadButton.click();
            console.log("after download button click")
        })
        
    `)

    console.log(response)
    driver.sleep(1000000)
}

async function main() {
    const driver = await getDriver();
    await openMeet(driver);
    await new Promise(x => setTimeout(x, 20000));
    // wait until admin lets u join
    // await startScreenshare(driver);
    
}
main();
