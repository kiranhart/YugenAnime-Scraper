const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(compression());
app.use(cors());

app.use(require('./routes'));


app.listen(PORT, () => {
    console.log(`YugenAnime Scraper by Kiran Hart running on port ${PORT}`);
});
