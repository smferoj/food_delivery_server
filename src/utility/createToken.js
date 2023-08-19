const jwt = require('jsonwebtoken');

function createToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = createToken;
