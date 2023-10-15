const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token missing");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedToken;
    next();
  } catch (error) {
    if (
      error.message.includes("Authorization header missing") ||
      error.message.includes("Token missing")
    ) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: error.message });
    }
  }
};

exports.authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token missing");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== "admin") {
      throw new Error("Unauthorized");
    }
    req.userData = decodedToken;
    next();
  } catch (error) {
    if (
      error.message.includes("Authorization header missing") ||
      error.message.includes("Token missing")
    ) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: error.message });
    }
  }
};
