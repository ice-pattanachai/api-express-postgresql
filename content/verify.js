const jwt = require('jsonwebtoken');

function containsDisallowedSql(input) {
  const disallowedSqlCommands = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE'];
  return disallowedSqlCommands.some(command => input.toUpperCase().includes(command));
}

function isPasswordValid(password) {
  return password.length >= 8;
}

function isPasswordComplex(password) {
  const containsDigit = /\d/.test(password);
  const containsLetter = /[a-zA-Z]/.test(password);
  const containsSpecialChar = /[^a-zA-Z0-9]/.test(password);
  return containsDigit && containsLetter && containsSpecialChar;
}

function verifyToken(req, res, next) {
  try {
    if (req.headers.authorization && req.headers.authorization !== 'undefined') {
      const token = req.headers.authorization.split(' ')[1];
      var decoded = jwt.verify(token, secret);
      console.log('| Authen username = ' + decoded.username + '| ' + '| Roles = ' + decoded.roles + '| ');
      next(); // ถ้า token ถูกต้อง ก็ทำการเรียกฟังก์ชั่นถัดไป
    } else {
      throw new Error('Authorization header is missing or undefined');
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = { containsDisallowedSql, isPasswordValid, isPasswordComplex, verifyToken };
