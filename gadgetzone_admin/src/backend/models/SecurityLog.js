import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SecurityLog = sequelize.define('SecurityLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  event_type: {
    type: DataTypes.ENUM('failed_login', 'rate_limit', 'suspicious_activity', 'brute_force'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('unread', 'resolved'),
    defaultValue: 'unread'
  }
}, {
  tableName: 'security_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SecurityLog;
