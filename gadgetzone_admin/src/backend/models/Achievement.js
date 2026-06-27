import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Achievement = sequelize.define('Achievement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Code unique identifiant l\'achievement'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    icon: {
        type: DataTypes.STRING(100),
        defaultValue: 'trophy'
    },
    points_reward: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tier_required: {
        type: DataTypes.ENUM('bronze', 'silver', 'gold', 'diamond'),
        defaultValue: 'bronze'
    }
}, {
    tableName: 'achievements',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['code']
        }
    ]
});

export default Achievement;
