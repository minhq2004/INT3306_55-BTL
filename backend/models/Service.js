module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      service_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      service_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      tableName: "services",
    }
  );

  Service.associate = (models) => {
    Service.hasMany(models.Booking, {
      foreignKey: "service_id",
    });
  };

  return Service;
};
