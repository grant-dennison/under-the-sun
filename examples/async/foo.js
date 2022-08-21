const fs = require("fs/promises");
const path = require("path");

exports.foo = async function () {
  return await fs.readFile(path.join(__dirname, "bar.txt"), "utf-8");
};
