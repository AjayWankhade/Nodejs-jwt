const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "yourSecretKey",
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token, user });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.json({ message: "Logout successful" });
  });
};

exports.profile = (req, res) => {
  res.json({ message: "You have access to the profile", user: req.user });
};

// Route middleware to ensure user is authenticated using JWT
exports.isAuthenticated = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "yourSecretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = decoded; // Set the decoded user information in the request object
    next();
  });
};
