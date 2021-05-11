const Sequelize = require("sequelize");
const fs = require("fs");

function SaveFromSequelize() {
  const sequelize = new Sequelize(process.env.DATABASE_URI, {
    dialect: "postgres",
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });

  // specify the path to the file, and create a buffer with characters we want to write
  let filename = "/home/vaduga/Documents/pic.jpeg";

  // open the file in writing mode, adding a callback function where we do the actual writing
  fs.open(filename, "w", async function (err, fd) {
    if (err) {
      throw "could not open file: " + err;
    }
    let buffer = await sequelize.query("SELECT * FROM orders WHERE customer=1");
    buffer = buffer[0][1].pic;
    // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      if (err) throw "error writing file: " + err;
      fs.close(fd, function () {
        console.log("wrote the file successfully");
      });
    });
  });
}

module.exports = SaveFromSequelize;
