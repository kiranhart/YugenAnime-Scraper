const express = require('express');
const router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');

const extractNonEpisodeData = require('../extractNonEpisodeData');

router.get('/', async(req, res) => {
    const queryPhrase = req.query.keyword || 'shield hero';
    const {data} = await axios.get(`https://yugenani.me/search/?q=${queryPhrase}`);
    const $ = cheerio.load(data);  
    res.json(extractNonEpisodeData($, $('a.anime-meta').toArray()));
});

module.exports = router;