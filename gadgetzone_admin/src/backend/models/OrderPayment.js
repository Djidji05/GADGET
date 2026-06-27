import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderPayment = sequelize.define('OrderPayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Lien vers la commande parente. Null si c\'est un Boost ou autre type.'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    comment: 'pending, paid, failed, refunded'
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.STRING,
    defaultValue: 'MonCash'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Référence interne unique générée pour le gateway'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'order_payments',
  timestamps: false,
  indexes: [
    { fields: ['order_id'] },
    { fields: ['transaction_id'] },
    { fields: ['reference'] }
  ]
});

export default OrderPayment;
