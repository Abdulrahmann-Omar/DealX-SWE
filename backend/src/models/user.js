import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true, 
  },
  email: {
    type: DataTypes.TEXT(100), 
    allowNull: true,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  full_name: {
    type: DataTypes.STRING(100), 
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING(15), 
    allowNull: true,
  },
  type : { 
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: true, 
  }
}, {
  tableName: 'users',  
  timestamps: false,  
});

export default User;
