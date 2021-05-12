const fs = require("fs");

const db = require("../config/db.config");

function SaveFromSequelize() {
  // specify the path to the file, and create a buffer with characters we want to write
  let filename = require("path").join(
    __dirname,
    "..",
    "uploads",
    "sql",
    "pic.jpeg"
  );

  // open the file in writing mode, adding a callback function where we do the actual writing
  fs.open(filename, "w", async function (err, fd) {
    if (err) {
      throw "could not open file: " + err;
    }
    let buffer = await db.sequelize.query(
      "SELECT * FROM orders WHERE customer=1"
    );
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
