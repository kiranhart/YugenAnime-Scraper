const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

const scraper = async (VideoUrl) => {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto(VideoUrl, {
      waitUntil: "networkidle0",
    });
    const [el] = await page.$x("/html/body/div[2]/div/div/div[2]/video/source");
    const src = await el.getProperty("src");
    const directUrl = await src.jsonValue();
    await browser.close();
    return { directUrl };
  } catch (err) {
    console.error(err);
  }
};

router.get("/", async (req, res) => {
  if (req.query.episodeURL) {
    await scraper(req.query.episodeURL).then((vidUrl) => {
      res.json(vidUrl);
    });
  } else {
    var error = "Episode URL not specified";
    res.json({ error });
  }
});

module.exports = router;
