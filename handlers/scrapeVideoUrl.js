const puppeteer = require("puppeteer-core");
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
    await page.waitForSelector("video");
    await page.goto(req.body.url);
    // localize video tag and extract src link
    const videoUrl = await page.$eval("video", (el) => el.src);
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
