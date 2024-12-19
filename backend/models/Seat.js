module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define(
    "Seat",
    {
      seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("available", "booked"),
        defaultValue: "available",
      },
      seat_type: {
        type: DataTypes.ENUM("economy", "business", "first class"),
        defaultValue: "economy",
      },
      seat_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "seats",
      timestamps: false,
    }
  );

  Seat.associate = (models) => {
    Seat.belongsTo(models.Flight, {
      foreignKey: "flight_id",
    });
    Seat.hasMany(models.Booking, {
      foreignKey: "seat_id",
    });
  };

  return Seat;
};
