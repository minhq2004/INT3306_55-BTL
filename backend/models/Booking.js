module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM("booked", "canceled", "paid"),
        defaultValue: "booked",
      },
      seat_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      service_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      tableName: "bookings",
      timestamps: true,
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "user_id",
    });
    Booking.belongsTo(models.Seat, {
      foreignKey: "seat_id",
    });
    Booking.belongsTo(models.Service, {
      foreignKey: "service_id",
    });
  };

  return Booking;
};
