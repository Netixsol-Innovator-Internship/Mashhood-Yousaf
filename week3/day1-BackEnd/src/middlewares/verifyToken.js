const jwt = require("jsonwebtoken");

const JWT_KEY = "chooseAnyStrongKey";

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (!req.headers.authorization) {
      throw new Error("No authorization header");
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentications Failed");
    }
    const decodedToken = jwt.verify(token, JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    console.log("token", token);
    next();
  } catch (err) {
    console.log("err", err);
    const error = new Error(
      "Authentications Failed, token...",
    );
    error.status = 401;
    console.log("error", error);
    return next(error);
  }
};
