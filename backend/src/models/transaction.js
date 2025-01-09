module.exports = (sequelize, DataTypes) => {
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
    });
  
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Transaction;
  };
  