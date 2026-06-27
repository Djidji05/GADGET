import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserAchievement = sequelize.define('UserAchievement', {
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
    achievement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'achievements',
            key: 'id'
        }
    },
    unlocked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_achievements',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            fields: ['user_id', 'achievement_id'],
            unique: true
        }
    ]
});

export default UserAchievement;
