const jwt = require('jsonwebtoken');
const User = require('../models/user');

//generates a token
exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email },  process.env.JWT_PASSWORD, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

// Decodes the token and recovers the encrypted fields
exports.decodeToken = function (token) {
  var userInfo = {};
  try {
    var decoded = jwt.verify(token, process.env.JWT_PASSWORD);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
  }
  return userInfo;
};

exports.validate = async function(decoded, request) {
  const user = await User.findOne({ _id: decoded.id });
  if (!user) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

exports.getUserIdFromRequest = function(request) {
  let userId;
  try {
    const authorization = request.headers.authorization;
    let token = authorization.split(' ')[1];
    let decodedToken = jwt.verify(token,  process.env.JWT_PASSWORD);
    userId = decodedToken.id;
  } catch (e) {
    userId = null;
  }
  return userId;
};
