import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'wishlists',
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['user_id', 'product_id'] },
        { fields: ['user_id'] }
    ]
});

export default Wishlist;
