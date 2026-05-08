import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Visit = sequelize.define('Visit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device_type: {
    type: DataTypes.STRING, // mobile, desktop, tablet, bot, other
    defaultValue: 'desktop'
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'visits',
  timestamps: false,
  indexes: [
    { fields: ['device_type'] },
    { fields: ['created_at'] },
    { fields: ['session_id'] },
    { fields: ['path'] }
  ]
});

export default Visit;
