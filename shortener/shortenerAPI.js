const express = require('express');
const router = express.Router();
const ShortenerServices = require('./shortenerServices')

router.post('/', ShortenerServices.shorten);

router.get('/:shortUrlId', ShortenerServices.findAndRedirect);

module.exports = router;