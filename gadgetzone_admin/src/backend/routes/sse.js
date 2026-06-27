import express from 'express';
import jwt from 'jsonwebtoken';
import { addConnection, removeConnection } from '../utils/sseManager.js';

const router = express.Router();

/**
 * GET /api/sse/stream — Connexion SSE persistante
 * Le client inclut son JWT en query param car les EventSource ne supportent pas les headers custom.
 */
router.get('/stream', async (req, res) => {
    // Authentification via query param (EventSource ne supporte pas les headers)
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
    } catch {
        return res.status(401).json({ error: 'Token invalide' });
    }

    // Headers SSE obligatoires
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Désactiver le buffering Nginx
    res.flushHeaders();

    // Message de bienvenue
    res.write(`event: connected\ndata: ${JSON.stringify({ userId, ts: Date.now() })}\n\n`);

    // Enregistrer la connexion
    addConnection(userId, res);

    // Nettoyage quand le client se déconnecte
    req.on('close', () => {
        removeConnection(userId, res);
        console.log(`📡 SSE: User ${userId} disconnected`);
    });
});

export default router;
