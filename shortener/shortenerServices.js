const validUrl = require('valid-url');
const shortId = require('shortid');
const assert = require('assert');

class ShortenerService {
    static async shorten(req, res) {
        const { longUrl } = req.body;
        const baseUrl = process.env.BASE_URL;

        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).json('Invalid base url');
        }

        if (!validUrl.isUri(longUrl)) {
            return res.status(401).json('Invalid long url');
        }
        
        try {
            const url = req.app.locals.db.collection('url').find({ longUrl: longUrl }).toArray(function(err, docs) {
                assert.equal(null, err);
            });
            
            if (url) {
                return res.status(200).json(...url);
            }
            
            const shortUrlId = shortId.generate();
            const shortUrl = `${ baseUrl }/${ shortUrlId }`;
            const newUrl = {
                longUrl: longUrl,
                shortUrlId: shortUrlId,
                shortUrl: shortUrl,
                insertedDate: new Date()
            }

            req.app.locals.db.collection('url').insertOne(newUrl, function(err, r) {
                assert.equal(null, err);
                assert.equal(1, r.insertedCount);
            });

            return res.status(200).json(shortUrl);

        } catch (err) {
            return res.status(500).json('Server error');
        }
    }
    
    static async findAndRedirect(req, res) {
        try {
            const url = await req.app.locals.db.collection('url').findOne({ shortUrlId: req.params.shortUrlId });

            if (!url) {
                return res.status(404).json('Url not found');
            }
            
            return res.redirect(url.longUrl);
        } catch (err) {
            return res.status(500).json('Server error');
        }
    }
}

module.exports = ShortenerService;