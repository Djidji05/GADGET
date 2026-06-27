/**
 * SSE Manager — Gestionnaire de connexions Server-Sent Events
 * Permet de pousser des notifications en temps réel aux utilisateurs connectés.
 */

// Map userId -> Set of Response objects (un user peut avoir plusieurs onglets)
const connections = new Map();

/**
 * Enregistrer une connexion SSE pour un utilisateur
 */
export const addConnection = (userId, res) => {
    if (!connections.has(userId)) {
        connections.set(userId, new Set());
    }
    connections.get(userId).add(res);
    console.log(`📡 SSE: User ${userId} connected (${connections.get(userId).size} tab(s))`);
};

/**
 * Supprimer une connexion quand le client se déconnecte
 */
export const removeConnection = (userId, res) => {
    const userConnections = connections.get(userId);
    if (userConnections) {
        userConnections.delete(res);
        if (userConnections.size === 0) {
            connections.delete(userId);
        }
    }
};

/**
 * Envoyer un événement à un utilisateur spécifique
 * @param {number} userId - ID de l'utilisateur cible
 * @param {string} event - Nom de l'événement (ex: 'new_order', 'trust_score_updated')
 * @param {object} data - Données à envoyer
 */
export const sendToUser = (userId, event, data) => {
    const userConnections = connections.get(userId);
    if (!userConnections || userConnections.size === 0) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const toRemove = [];

    for (const res of userConnections) {
        try {
            res.write(payload);
        } catch (err) {
            // La connexion est morte — nettoyer
            toRemove.push(res);
        }
    }

    toRemove.forEach(res => userConnections.delete(res));
    if (userConnections.size === 0) connections.delete(userId);
};

/**
 * Envoyer un heartbeat à toutes les connexions pour les garder vivantes
 */
export const broadcastHeartbeat = () => {
    const ping = `: heartbeat\n\n`;
    const dead = [];

    for (const [userId, userConnections] of connections) {
        for (const res of userConnections) {
            try {
                res.write(ping);
            } catch {
                dead.push([userId, res]);
            }
        }
    }

    dead.forEach(([userId, res]) => removeConnection(userId, res));
};

// Heartbeat toutes les 30 secondes
setInterval(broadcastHeartbeat, 30_000);

export default { addConnection, removeConnection, sendToUser, broadcastHeartbeat };
