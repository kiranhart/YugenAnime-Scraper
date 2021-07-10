const extractNonEpisodeData = ($, array) => {
    const results = [];

    array.forEach((e) => {
        results.push({
            anime: {
                name: e.attribs.title,
                slug: e.attribs.href.replace('/anime/', '').split('/')[1],
                id: Number(e.attribs.href.replace('/anime/', '').split('/')[0])
            },
            poster: $(e).find('div.anime-poster__container > img').attr('data-src'),
            rating: Number($(e).find('.option').text().trim()),
            yearType: $(e).find('.anime-details > span').text().trim()
        });
    });
    return results;
}; 

module.exports = extractNonEpisodeData;