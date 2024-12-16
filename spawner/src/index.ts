import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { Config } from "./constants/puppeter";
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const videoDir = path.join(process.cwd(), 'report', 'video');
  fs.mkdirSync(videoDir, { recursive: true });

  const options = new Options({});
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--use-fake-ui-for-media-stream");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page, Config);

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  try {
    await driver.get("https://meet.google.com/igt-mdwv-ppp");
    const popupButton = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')),
      10000
    );
    await popupButton.click();
    const nameInput = await driver.wait(
      until.elementLocated(By.xpath('//input[@placeholder="Your name"]')),
      10000
    );
    await nameInput.clear();
    await nameInput.click();
    await nameInput.sendKeys("value", "Meeting bot");
    await driver.sleep(1000);
    const buttonInput = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')),
      10000
    );
    buttonInput.click();

    await recorder.start("./report/video/simple.mp4");
    console.log("🎥 Recording started - saving to ./report/video/simple.mp4");

    const meetUrl = await driver.getCurrentUrl();
    await page.goto(meetUrl);

    await driver.sleep(30000); 

    console.log("⏹️ Stopping recording...");
    await recorder.stop();
    console.log("✅ Recording saved successfully!");

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await recorder.stop();
    await driver.quit();
    await browser.close();
  }
}

main().catch(console.error);
