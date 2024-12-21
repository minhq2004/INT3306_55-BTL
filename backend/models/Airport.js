module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define(
    "Airport",
    {
      airport_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      airport_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "unique_city_country", // Đảm bảo kết hợp city và country là duy nhất
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "unique_city_country", // Đảm bảo kết hợp city và country là duy nhất
      },
    },
    {
      tableName: "airports",
      timestamps: false,
      indexes: [
        {
          name: "idx_name",
          fields: ["airport_name"],
        },
        {
          name: "idx_city",
          fields: ["city"],
        },
        {
          name: "idx_country",
          fields: ["country"],
        },
      ],
    }
  );

  return Airport;
};
