const path = require("path");

const filename = (originalname) => {
  const extension = path.extname(originalname);
  const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e4);
  return originalname.replace(extension, "") + "-" + uniquePrefix + extension;
};

module.exports = filename;
