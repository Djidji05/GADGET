import express from 'express';
import upload from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import s3Service from '../services/S3Service.js';
import cloudinaryService from '../services/CloudinaryService.js';
import fs from 'fs';

const router = express.Router();


/**
 * Helper to check if Cloudinary is properly configured
 */
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;
};

/**
 * POST /api/upload
 * Upload multiple files (max 5)
 * Strategy: Cloudinary (if configured) > Supabase (if configured) > S3 (if configured) > Local
 */
router.post('/', authenticateToken, (req, res, next) => {
    // Handle both images (max 5) and video (max 1) fields
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'video', maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            console.error('[Upload Route] Multer Error:', err);
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    const imageFiles = req.files && req.files['images'] ? req.files['images'] : [];
    const videoFiles = req.files && req.files['video'] ? req.files['video'] : [];

    if (imageFiles.length === 0 && videoFiles.length === 0) {
        return res.status(400).json({ error: 'Aucun fichier fourni ou format invalide.' });
    }

    try {
        const useCloudinary = isCloudinaryConfigured();
        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT || 3003}`;

        const uploadFileHelper = async (file, folder) => {
            let cloudinaryUrl = null;
            if (useCloudinary) {
                try {
                    cloudinaryUrl = await cloudinaryService.uploadFile(file.path, folder);
                    if (cloudinaryUrl) console.log(`✅ Hybrid: Uploaded file to Cloudinary: ${cloudinaryUrl}`);
                } catch (e) {
                    console.error('❌ Hybrid: Cloudinary failed:', e.message);
                }
            }
            const localPath = `/uploads/products/${file.filename}`;
            const localUrl = `${backendUrl}${localPath}`;
            console.log(`✅ Hybrid: Local fallback ready: ${localUrl}`);
            return {
                url: cloudinaryUrl || localUrl,
                fallback: localUrl
            };
        };

        const imageResults = [];
        for (const file of imageFiles) {
            const uploaded = await uploadFileHelper(file, 'products');
            imageResults.push(uploaded);
        }

        let videoResult = null;
        if (videoFiles.length > 0) {
            videoResult = await uploadFileHelper(videoFiles[0], 'products');
        }

        res.json({
            message: 'Fichiers téléversés avec succès (Stratégie Hybride Cloudinary + Local)',
            urls: imageResults.map(r => r.url),
            hybrid: imageResults,
            video: videoResult
        });
    } catch (error) {
        console.error('[Upload Route] Hybrid Local Error:', error.message);
        res.status(500).json({ error: 'Erreur lors du traitement hybride local des fichiers.' });
    }
});

export default router;
