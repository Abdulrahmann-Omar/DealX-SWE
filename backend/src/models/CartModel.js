import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cart = sequelize.define('Cart_items', {

cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
},
product_id: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true, 
},
quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, 
},

}, {
tableName: 'cart_items',
timestamps: false, 
});

export default Cart;
