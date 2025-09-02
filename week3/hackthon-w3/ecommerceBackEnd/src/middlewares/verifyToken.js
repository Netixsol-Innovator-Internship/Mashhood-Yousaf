const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userSchema");

const JWT_KEY = "chooseAnyStrongKey";

const checkAuth = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (!req.headers.authorization) {
      const error = new ErrorResponse(
        "No authorization header",
        404,
        {},
        false
      );
      return next(error);
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const error = new ErrorResponse("No Token,Auth Failed", 404, {}, false);
      return next(error);
    }
    const decodedToken = jwt.verify(token, JWT_KEY);
    const user = await User.findById(decodedToken.userId);

    if (!user || user.isBlocked) {
      return res.status(403).json({ message: "User blocked or not found" });
    }

    req.userData = { userId: decodedToken.userId, role: decodedToken.role };

    //  fix Use user.role from database instead of decodedToken.role
    // req.userData = {
    //   userId: user._id.toString(),
    //   role: user.role, // This is the crucial fix
    // };
    console.log("req.userData", req.userData);

    // console.log("token", token);
    next();
  } catch (err) {
    console.log("err", err);
    const error = new ErrorResponse(
      "Authentications Failed, token...",
      500,
      {},
      false
    );
    return next(error);
  }
};


module.exports = {
  checkAuth,
  
};
