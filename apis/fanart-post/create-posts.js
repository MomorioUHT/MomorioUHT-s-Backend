const express = require('express');
const validApiKey = require('../../middleware/validate-api-key');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const generateRandomId = require('../../middleware/random-id');

module.exports = (pool) => {
    const router = express.Router();

    const uploadDir = path.join(__dirname, '../../uploads/fanart_posts');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `fanart_${Date.now()}${ext}`;
            cb(null, filename);
        }
    });
    const upload = multer({ 
        storage,
        fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed'), false);
        }
    }});

    router.post('/', validApiKey, async (req, res) => {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({error: err.message});
            }

            try {
                const title = req.body.title;
                const artist = req.body.artist;
                const uploaderId = req.body.uploaderId;

                if (!title || !artist || !req.file) {
                    return res.status(400).json({ error: 'title, artist and image are required'});
                }

                const imagePath = `/uploads/fanart_posts/${req.file.filename}`;
                const id = generateRandomId(20);

                await pool.execute(
                    'INSERT INTO fanart_posts (id, title, artist, image_path, uploader, creation_date) VALUES (?, ?, ?, ?, ?, NOW())',
                    [id, title, artist, imagePath, uploaderId]
                );

                return res.status(201).json({
                    success: true,
                    message: 'Fanart post created successfully',
                    image: imagePath,
                    id: id
                });
            } catch (error) {
                console.error('Internal Server Error: ', error);
                return res.status(500).json({
                    success: false,
                    error: 'Internal Server Error'
                });
            }
        });
    })

    return router;
}