module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("news", "promotion", "announcement", "about"),
        allowNull: false,
      },
    },
    {
      tableName: "posts",
      timestamps: true,
    }
  );

  Post.associate = (models) => {
    Post.hasMany(models.File, {
      foreignKey: "post_id",
    });
  };

  return Post;
};
