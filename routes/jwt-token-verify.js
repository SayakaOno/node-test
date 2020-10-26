const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifytoken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(400).json('Toekn not provided in auth-token header');
  }
  try {
    const jwtTokenVerify = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    req.user = jwtTokenVerify;
  } catch (err) {
    res.status(400).json('Wrong token');
  }
  next();
};

module.exports = verifytoken;
