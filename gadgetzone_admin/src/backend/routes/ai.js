import express from 'express';
import AIController from '../controllers/AIController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/ai/chat
 * Endpoint pour l'assistant IA client (boutique publique)
 */
router.post('/chat', AIController.handleChat);

/**
 * POST /api/ai/seller-chat
 * Endpoint pour l'assistant IA Vendeur (espace seller)
 */
router.post('/seller-chat', authenticateToken, AIController.handleSellerChat);

/**
 * GET /api/ai/suggestions
 * Récupère des suggestions de questions basées sur le contexte
 */
router.get('/suggestions', AIController.getSuggestions);

export default router;
