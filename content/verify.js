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
  
  module.exports = { containsDisallowedSql, isPasswordValid, isPasswordComplex };
  