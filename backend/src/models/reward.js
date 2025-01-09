module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define('Reward', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points_required: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      expiry_date: {
        type: DataTypes.DATE,
      },
    });
  
    return Reward;
  };
  