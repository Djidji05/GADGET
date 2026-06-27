import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  image_url: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_new: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  has_variants: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  variants: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  buy_box_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null
  },
  sales_count: {

    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  average_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_sponsored: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active' // 'active', 'deleted'
  },
  moderation_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending' // New products require approval
  },
  admin_note: {
    type: DataTypes.TEXT,
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
  tableName: 'products',
  timestamps: false,
  indexes: [
    { fields: ['status', 'created_at'] }, // 🚀 Accélère les stats de nouveaux produits
    { fields: ['price'] },
    { fields: ['category_id'] },
    { fields: ['is_featured'] },
    { fields: ['is_new'] },
    { fields: ['storeId'] },
    { 
      fields: ['is_sponsored', 'average_rating', 'sales_count', 'created_at'],
      name: 'products_super_sort_idx'
    }
  ]
});

export default Product;
