const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([
        {
            route: '/latest',
            query: [
                '?page=',
                'default page = 1'
            ]
        },
        {
            route: '/trending',
            query: [
                '?page=',
                'default page = 1'
            ]
        },
        {
            route: '/best',
            query: [
                '?page=',
                'default page = 1'
            ]
        },
        {
            route: '/search',
            query: [
                '?keyword=',
                'default phrase = shield hero'
            ]
        },
        {
            route: '/details',
            query: [
                '?id=',
                '&slug=',
                'default id = 5792',
                'default slug = tate-no-yuusha-no-nariagari'
            ]
        },
        {
            route: '/episode',
            query: [
                '?id=',
                '&slug=',
                '&episode',
                'default id = 5792',
                'default slug = tate-no-yuusha-no-nariagari',
                'default episode = 1'
            ]
        }
    ]);
});

router.use('/latest', require('./latest'));
router.use('/trending', require('./trending'));
router.use('/best', require('./best'));
router.use('/search', require('./search'));
router.use('/details', require('./details'));
router.use('/episode', require('./episode'));

module.exports = router;