module.exports = (sequelize, DataTypes) => {
  const Airplane = sequelize.define(
    "Airplane",
    {
      airplane_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      manufacturer: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "airplanes",
      timestamps: true,
    }
  );

  Airplane.associate = (models) => {
    Airplane.hasMany(models.Flight, {
      foreignKey: "airplane_id",
    });
  };

  return Airplane;
};
