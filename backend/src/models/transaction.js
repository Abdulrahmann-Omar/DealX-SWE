import { DataTypes } from 'sequelize';

// Use ES module export syntax
export default (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
      points_earned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      points_redeemed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.STRING,
      },
      // Sequelize automatically adds createdAt and updatedAt if timestamps: true (default)
      // Foreign key (user_id) will be added via association
    }, {
      // Explicitly define table name if needed, otherwise Sequelize pluralizes model name
      // tableName: 'transactions',
      // timestamps: true // Default is true
    });

    Transaction.associate = (models) => {
      // Use the actual model name ('User' or 'user' depending on how it's defined and imported)
      Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Transaction;
  };
