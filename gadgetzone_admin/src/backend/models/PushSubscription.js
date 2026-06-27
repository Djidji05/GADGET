import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * PushSubscription — Stocke les abonnements Web Push par utilisateur.
 * Un utilisateur peut avoir plusieurs appareils enregistrés.
 */
const PushSubscription = sequelize.define('PushSubscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'URL de l\'endpoint Push du navigateur'
    },
    keys_p256dh: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Clé publique ECDH P-256'
    },
    keys_auth: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Secret d\'authentification'
    },
    user_agent: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Navigateur / appareil'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'push_subscriptions',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['endpoint'], unique: true }
    ]
});

export default PushSubscription;
