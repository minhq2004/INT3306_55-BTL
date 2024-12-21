const jwt = require("jsonwebtoken");
require("dotenv").config();

// Ham xac thuc token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired" });
    }
    console.error("Invalid Token:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// Xac minh kiểm tra role
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: `Forbidden: Requires ${requiredRole} role` });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
