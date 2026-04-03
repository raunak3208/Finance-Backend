const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },   
    process.env.JWT_SECRET,       
    { expiresIn: '7d' }           // token expires in 7 days
  );
};

module.exports = generateToken;