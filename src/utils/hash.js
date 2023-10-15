const bcrypt = require("bcrypt");

const hash = async (plaintextPassword) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
  return hashedPassword;
};

module.exports = hash;
