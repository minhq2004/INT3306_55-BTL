module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      file_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: "files",
      timestamps: true,
    }
  );

  File.associate = (models) => {
    File.belongsTo(models.Post, {
      foreignKey: "post_id",
    });
  };

  return File;
};
