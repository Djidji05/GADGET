import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LoyaltyTransaction = sequelize.define('LoyaltyTransaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    points_earned: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    points_spent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'purchase_reward | checkout_redeem | manual_credit | expiry'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'loyalty_transactions',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id', 'created_at'] },
        { fields: ['order_id'] }
    ]
});

export default LoyaltyTransaction;
