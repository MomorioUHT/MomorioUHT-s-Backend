const express = require('express');
const validApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validApiKey, async (req, res) => {
        try {
            let cmd = 'SELECT id,title,artist,image_path,uploader,creation_date FROM fanart_posts WHERE 1=1';
            let params = [];

            if (req.query.id) {
                cmd += ' AND id = ?';
                params.push(req.query.id);
            }
            if (req.query.artist) {
                cmd += ' AND artist = ?';
                params.push(req.query.artist);
            }
            if (req.query.uploader) {
                cmd += ' AND uploader = ?';
                params.push(req.query.uploader);
            }

            cmd += ' ORDER BY creation_date DESC';

            const [rows] = await pool.execute(cmd, params);
            if (rows.length === 0) {
                return res.status(404).json({error: 'No posts found'});
            }
            
            return res.status(200).json(rows);

        } catch (error) {
            console.error('Internal Server Error: ', error);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    })

    return router;
}