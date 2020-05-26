const express = require('express');
const mongo = require('./mongoDB');

require('dotenv').config();

const app = express();

mongo.connect(app);

app.use(express.json());

app.use('/', require('./shortener/shortenerAPI'));

app.listen(process.env.PORT, () => console.log(`server rodando na porta ${ process.env.PORT }`));