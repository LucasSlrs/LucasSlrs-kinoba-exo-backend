const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const jwtToken = req.header("token");
  if (!jwtToken) {
    res.status(403).json("Not Authorize");
  }
  try {
    const verify = jwt.verify(jwtToken, process.env.jwtSecret);
    req.user = verify.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorize");
  }
};
