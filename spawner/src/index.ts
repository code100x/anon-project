import { Builder, Browser, By, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'

async function openMeet(driver: WebDriver) {
  
  try {
    await driver.get('https://meet.google.com/xor-zvhr-uif');
    ​​const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')), 10000);
    await popupButton.click();
    ​​const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
    await nameInput.clear();
    await nameInput.click();
    await nameInput.sendKeys('value', "Meeting bot");
    await driver.sleep(1000)
    ​​const buttonInput = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
    buttonInput.click();
    await driver.wait(until.elementLocated(By.id('123123c12')), 1000000);
    
  } finally {
    await driver.quit()
  }
}

async function getDriver() {
    const options = new Options({})
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--use-fake-ui-for-media-stream");
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    return driver;
}

function startScreenshare(driver: WebDriver) {

}

async function main() {
    const driver = await getDriver();
    await openMeet(driver);
    // wait until admin lets u join
    await startScreenshare(driver);
}
main();