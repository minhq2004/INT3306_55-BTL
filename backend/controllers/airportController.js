const { Airport } = require("../models");
const { Op } = require("sequelize");

const escapeLike = (str) => {
  return str.replace(/[%_]/g, "\\$&");
};

const rcmLocations = async (req, res) => {
  const query = req.params.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    // Xử lý ký tự đặc biệt
    const escapedQuery = escapeLike(query);
    const likeQuery = `%${escapedQuery}%`;

    // Tìm kiếm các quốc gia và thành phố phù hợp với truy vấn
    const locations = await Airport.findAll({
      where: {
        [Op.or]: [
          { country: { [Op.like]: likeQuery } },
          { city: { [Op.like]: likeQuery } },
        ],
      },
      attributes: ["country", "city"],
      group: ["country", "city"],
      order: [
        ["country", "DESC"],
        ["city", "ASC"],
      ],
    });

    // Xử lý dữ liệu để nhóm thành quốc gia và các thành phố
    const locationMap = {};

    locations.forEach((location) => {
      const country = location.country;
      const city = location.city;

      if (country) {
        if (!locationMap[country]) {
          locationMap[country] = new Set();
        }
        if (city) {
          locationMap[country].add(city);
        }
      }
    });

    // Chuyển đổi map thành mảng với cấu trúc mong muốn
    const groupedLocations = Object.keys(locationMap).map((country) => ({
      country: country,
      cities: Array.from(locationMap[country]).sort(),
    }));

    res.json(groupedLocations);
  } catch (err) {
    console.error("Error location:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const rcmAllLocations = async (req, res) => {
  try {
    const locations = await Airport.findAll({
      attributes: ["country", "city"],
      group: ["country", "city"],
      order: [
        ["country", "DESC"],
        ["city", "ASC"],
      ],
    });

    const locationMap = {};

    locations.forEach((location) => {
      const country = location.country;
      const city = location.city;

      if (country) {
        if (!locationMap[country]) {
          locationMap[country] = new Set();
        }
        if (city) {
          locationMap[country].add(city);
        }
      }
    });

    const groupedLocations = Object.keys(locationMap).map((country) => ({
      country: country,
      cities: Array.from(locationMap[country]).sort(),
    }));

    res.json(groupedLocations);
  } catch (err) {
    console.error("Error get all location:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { rcmLocations, rcmAllLocations };
