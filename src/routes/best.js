const express = require('express');
const router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');

const extractNonEpisodeData = require('../extractNonEpisodeData');

router.get('/', async(req, res) => {
    const page = Number(req.query.page) || 1;
    const {data} = await axios.get(`https://yugenani.me/best/?page=${page}`);
    const $ = cheerio.load(data);
    res.json(extractNonEpisodeData($, $('a.anime-meta').toArray()));
});

module.exports = router;