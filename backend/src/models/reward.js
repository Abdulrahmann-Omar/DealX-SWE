import { DataTypes } from 'sequelize';

// Use ES module export syntax
export default (sequelize) => {
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
      // Sequelize automatically adds createdAt and updatedAt if timestamps: true (default)
    }, {
      // Explicitly define table name if needed, otherwise Sequelize pluralizes model name
      // tableName: 'rewards',
      // timestamps: true // Default is true
    });

    // Define associations here if necessary
    // Reward.associate = (models) => {
    //   // associations can be defined here
    // };

    return Reward;
  };
