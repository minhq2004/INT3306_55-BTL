module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    "Discount",
    {
      discount_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
      },
      discount_percentage: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false, 
        defaultValue: 0, 
      },
    },
    {
      timestamps: true,
      tableName: "discounts",
    }
  );

  return Discount;
};
