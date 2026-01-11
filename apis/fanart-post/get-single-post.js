const express = require('express');
const validApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();
    
    router.get('/:id', validApiKey, async (req, res) => {
        try {
            const id = req.params.id;

            const [rows] = await pool.execute(
                `SELECT id,title,artist,image_path,uploader,creation_date
                FROM fanart_posts
                WHERE id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: rows[0]
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    });

    return router;
};