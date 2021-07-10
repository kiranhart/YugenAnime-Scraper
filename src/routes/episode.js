const express = require('express');
const router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async(req, res) => {
    const animeId = Number(req.query.id) || 5792;
    let animeSlug = req.query.slug || 'tate-no-yuusha-no-nariagari';
    const episode = Number(req.query.episode) || 1;
    animeSlug = animeSlug.replace('-dub', '');

    let animeTitle = null;
    let title = null;
    let description = null;
    const videos = [];

    const promises = await Promise.allSettled([
        axios.get(`https://yugenani.me/watch/${animeId}/${animeSlug}/${episode}`, {
            headers: {
                'Requested-Language': 'Subbed'
            }
        }),
        axios.get(`https://yugenani.me/watch/${animeId}/${animeSlug}-dub/${episode}`)
    ]);

    promises.filter((result) => result.status == 'fulfilled').forEach((result) => {
        const $ = cheerio.load(result.value.data);

        // we only gotta grab the desc and ep title once
        if (Object.keys(result.value.config.headers).includes('Requested-Language') && result.value.config.headers['Requested-Language'] === 'Subbed') {
            animeTitle = $('#wrapper > div > div.col.col-w-65 > div:nth-child(2) > div.flex.justify-content-between.align-items-center > div:nth-child(1) > div > a.link > h1').text();
            title = $('#wrapper > div > div.col.col-w-65 > div.box.m-10-b.p-15.w-100 > h1').text().split(' ').splice(2, $('#wrapper > div > div.col.col-w-65 > div.box.m-10-b.p-15.w-100 > h1').text().replace(' ').length).join(' ');
            description = $('#wrapper > div > div.col.col-w-65 > div:nth-child(3) > div:nth-child(1) > p').text() || $('#wrapper > div > div.col.col-w-65 > div:nth-child(4) > div:nth-child(1) > p').text();
        }

        videos.push({
            language: Object.keys(result.value.config.headers).includes('Requested-Language') && result.value.config.headers['Requested-Language'] === 'Subbed' ? 'Subbed' : 'Dubbed',
            video: $('#main-embed').attr('src')
        });
    });

    res.json({
        anime: {
            title: animeTitle,
            slug: animeSlug,
            id: animeId
        },
        title,
        description,
        videos
    });
});

module.exports = router;