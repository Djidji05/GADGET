import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const QRPayment = sequelize.define('QRPayment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'id'
        }
    },
    ref: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'expired'),
        defaultValue: 'pending'
    },
    payer_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'qr_payments',
    timestamps: true,
    underscored: true
});

export default QRPayment;
