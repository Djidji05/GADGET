import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LoyaltyAccount = sequelize.define('LoyaltyAccount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    points_balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lifetime_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total de points gagnés depuis toujours (pour niveaux)'
    },
    tier: {
        type: DataTypes.ENUM('bronze', 'silver', 'gold', 'diamond'),
        defaultValue: 'bronze'
    },
    tier_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'loyalty_accounts',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['user_id'] }]
});

export default LoyaltyAccount;
