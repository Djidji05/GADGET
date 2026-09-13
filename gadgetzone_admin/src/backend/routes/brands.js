import express from 'express';
import Brand from '../models/Brand.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { clearCache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Configuration multer pour les logos de marques avec création automatique du dossier
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/brands/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// GET /api/brands - Récupérer toutes les marques
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.findAll({
            order: [['name', 'ASC']]
        });
        res.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des marques' });
    }
});

// POST /api/brands - Créer une marque (Admin)
router.post('/', authenticateToken, requireAdmin, (req, res, next) => {
    upload.single('logo')(req, res, (err) => {
        if (err) {
            console.error('[Brands Route] Multer upload error:', err);
            return res.status(400).json({ error: 'Erreur lors du téléversement du logo: ' + err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Le nom de la marque est requis.' });
        }

        const logo_url = req.file 
            ? `/uploads/brands/${req.file.filename}` 
            : (req.body.logo_url || req.body.logo || null);

        const brand = await Brand.create({
            name: name.trim(),
            description: description ? description.trim() : null,
            logo_url
        });

        clearCache('/brands');
        res.status(201).json(brand);
    } catch (error) {
        console.error('Error creating brand:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Une marque portant ce nom existe déjà.' });
        }
        res.status(500).json({ error: error.message || 'Erreur lors de la création de la marque' });
    }
});

// PUT /api/brands/:id - Modifier une marque (Admin)
router.put('/:id', authenticateToken, requireAdmin, (req, res, next) => {
    upload.single('logo')(req, res, (err) => {
        if (err) {
            console.error('[Brands Route] Multer upload error:', err);
            return res.status(400).json({ error: 'Erreur lors du téléversement du logo: ' + err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ error: 'Marque non trouvée' });

        const { name, description } = req.body;
        if (name && name.trim()) brand.name = name.trim();
        if (description !== undefined) brand.description = description ? description.trim() : null;
        if (req.file) {
            brand.logo_url = `/uploads/brands/${req.file.filename}`;
        } else if (req.body.logo_url !== undefined) {
            brand.logo_url = req.body.logo_url;
        }

        await brand.save();
        clearCache('/brands');
        res.json(brand);
    } catch (error) {
        console.error('Error updating brand:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Une marque portant ce nom existe déjà.' });
        }
        res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour' });
    }
});

// DELETE /api/brands/:id - Supprimer une marque (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ error: 'Marque non trouvée' });

        await brand.destroy();
        clearCache('/brands');
        res.json({ message: 'Marque supprimée' });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ error: error.message || 'Erreur lors de la suppression' });
    }
});

export default router;
