const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, 'JWT_SECRET');
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ msg: " token isnot correct" });
  }
};
