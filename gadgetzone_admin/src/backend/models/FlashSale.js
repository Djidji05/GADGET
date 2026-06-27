import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FlashSale = sequelize.define('FlashSale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'NULL = flash sale admin global'
    },
    original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    flash_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    stock_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'NULL = pas de limite de stock'
    },
    current_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'active', 'ended', 'cancelled'),
        defaultValue: 'scheduled'
    }
}, {
    tableName: 'flash_sales',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['status', 'start_at', 'end_at'] },
        { fields: ['product_id'] },
        { fields: ['store_id'] }
    ]
});

export default FlashSale;
