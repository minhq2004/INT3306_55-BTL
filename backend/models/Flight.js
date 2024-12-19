module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define(
    "Flight",
    {
      flight_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      flight_number: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
      },
      departure: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      departure_date: {
        type: DataTypes.DATEONLY, // Chỉ lưu ngày (YYYY-MM-DD)
        allowNull: false,
      },
      departure_time: {
        type: DataTypes.TIME, // Chỉ lưu giờ (HH:mm:ss)
        allowNull: false,
      },
      arrival_date: {
        type: DataTypes.DATEONLY, // Chỉ lưu ngày (YYYY-MM-DD)
        allowNull: false,
      },
      arrival_time: {
        type: DataTypes.TIME, // Chỉ lưu giờ (HH:mm:ss)
        allowNull: false,
      },
      airplane_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("scheduled", "completed", "canceled", "delayed"),
        defaultValue: "scheduled",
      },
    },
    {
      tableName: "flights",
      timestamps: true,
    }
  );

  Flight.associate = (models) => {
    // n:1 quan hệ giữa Flight và Airplane
    Flight.belongsTo(models.Airplane, {
      foreignKey: "airplane_id",
    });

    // 1:n quan hệ giữa Flight và Seat
    Flight.hasMany(models.Seat, {
      foreignKey: "flight_id",
    });
  };

  return Flight;
};
