// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const chromium = require("@sparticuz/chromium");

module.exports = async function (req, res, next) {
  // initialize browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  try {
    await page.goto(req.body.url);
    await page.waitForSelector("video");
    // localize video tag and extract src link
    let videoUrl = await page.$eval("video", (el) => el.src);

    // if video.src is not found search for source element
    if (!videoUrl) {
      videoUrl = await page.$eval("source", (el) => el.src);
    }

    res.json({ original_url: req.body.url, video_url: videoUrl });
  } catch (err) {
    next(err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  await browser.close();
};
