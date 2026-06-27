import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'approved'
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    is_verified_purchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'True si le client a une commande livrée de ce produit'
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL d\'une vidéo d\'avis uploadée par le client'
    },
    helpful_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Nombre de votes "utile"'
    },
    not_helpful_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Nombre de votes "inutile"'
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true
});

export default Review;
