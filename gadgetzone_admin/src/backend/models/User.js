import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Nullable pour social login
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  role: {
    type: DataTypes.STRING, // 'admin', 'seller', 'customer' (formerly 'user')
    defaultValue: 'customer'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  referral_code: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  is_ambassador: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Actif'
  },
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  two_factor_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  two_factor_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notif_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notif_push: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notif_sms: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    { fields: ['role', 'created_at'] }, // 🚀 Accélère les stats de nouveaux clients
    { fields: ['role'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

export default User;
