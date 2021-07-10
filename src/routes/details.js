const express = require('express');
const router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async(req, res) => {
    const animeId = Number(req.query.id) || 5792;
    const animeSlug = req.query.slug || 'tate-no-yuusha-no-nariagari';
    const {data} = await axios.get(`https://yugenani.me/anime/${animeId}/${animeSlug}/watch/`);
    const $ = cheerio.load(data);  

    let romajiTitle = null;
    let nativeTitle = null;
    let synonyms = null;
    let format = null;
    let studios = null;
    let subEpisodes = null;
    let dubEpisodes = null;
    let status = null;
    let premiered = null;
    let genres = null;

    $('.anime-metadetails > .data').toArray().forEach((e) => {
        const metaTitle = $(e).find('.ap--data-title').text();
        switch(metaTitle) {
        case 'Romaji': 
            romajiTitle = $(e).find('span.description').text();
            break;
        case 'Native': 
            nativeTitle = $(e).find('span.description').text();
            break;
        case 'Synonyms': 
            synonyms = $(e).find('span.description').text();
            break;
        case 'Format': 
            format = $(e).find('span.description').text();
            break;
        case 'Studios': 
            studios = $(e).find('span.description').text().split(', ').map((e) => e.trim());
            break;
        case 'Episodes': 
            subEpisodes = Number($(e).find('span.description').text());
            break;
        case 'Episodes (Dub)': 
            dubEpisodes = Number($(e).find('span.description').text());
            break;
        case 'Status': 
            status = $(e).find('span.description').text();
            break;
        case 'Premiered': 
            premiered = $(e).find('span.description').text();
            break;
        case 'Genres': 
            genres = $(e).find('span.description').text().split(', ').map((e) => e.trim());
            break;
        }
    });

    const episodes = [];
    $('.ep-card').toArray().forEach((e) => {
        episodes.push({
            episode: Number($(e).find('a').attr('href').split('/').filter((e) => e != '').pop()),
            title: $(e).find('a').attr('title').split(' ').slice(2, $(e).find('a').attr('title').split(' ').length).join(' '),
            poster: $(e).find('a > img').attr('data-src') || $(e).find('a > img').attr('onerror').replace('this.src=\'', '').replace('\'', ''),
            duration: $(e).find('a > div.ep-duration').text().replace('per ep.', '').trim()
        });
    });

    res.json({
        titles: {
            title: $('.content > h1').text(),
            romaji: romajiTitle,
            native: nativeTitle
        },
        poster: $('img.cover').attr('src'),
        score: Number($('.anime-score > span').text().toLowerCase().replace('average score', '').trim()),
        synonyms,
        format,
        studios,
        episodeCount: {
            subbed: subEpisodes,
            dubbed: dubEpisodes
        },
        status,
        premiered,
        genres,
        episodes
    });
});

module.exports = router;