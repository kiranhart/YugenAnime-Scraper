const express = require('express');
const router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async(req, res) => {
    const page = Number(req.query.page) || 1;
    const {data} = await axios.get(`https://yugenani.me/latest/?page=${page}`);
    const $ = cheerio.load(data);
    const results = [];

    $('li.ep-card').toArray().forEach((e) => {
        results.push({
            anime: {
                name: $(e).find('.ep-origin-name').text(),
                slug: $(e).find('a.ep-thumbnail').attr('href').replace('/watch/', '').split('/')[1],
                id: Number($(e).find('a.ep-thumbnail').attr('href').replace('/watch/', '').split('/')[0]),
            },
            poster: $(e).find('img').attr('onerror').replace('this.src=\'', '').replace('\'', ''),
            episodeTitle: $(e).find('.ep-title').text().split(' ').slice(2, $(e).find('.ep-title').text().split(' ').length).join(' '),
            episode: Number($(e).find('a.ep-thumbnail').attr('href').split('/').filter((e) => e != '').pop()),
            episodeDuration: $(e).find('a > div.ep-bubble.ep-duration').text()
        });
    });

    res.json(results);
});

module.exports = router;