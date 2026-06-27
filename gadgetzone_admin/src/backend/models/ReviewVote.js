import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * ReviewVote — Votes "utile" / "inutile" sur les avis produits.
 * Un utilisateur ne peut voter qu'une seule fois par avis.
 */
const ReviewVote = sequelize.define('ReviewVote', {
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
    review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reviews',
            key: 'id'
        }
    },
    vote: {
        type: DataTypes.ENUM('helpful', 'not_helpful'),
        allowNull: false
    }
}, {
    tableName: 'review_votes',
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['user_id', 'review_id'] },
        { fields: ['review_id'] }
    ]
});

export default ReviewVote;
