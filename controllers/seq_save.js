import Sequelize from "sequelize";
import * as fs from "fs";

function SaveFromSequelize() {
  const sequelize = new Sequelize(
    "postgres://trtmlpgshwofaq:92b2ea3d96b853d3423efbc7ba49b94f5c9dee4200e8c325251fa30437a6f4fa@ec2-52-19-164-214.eu-west-1.compute.amazonaws.com:5432/daq7bh988dhuup",
    {
      dialect: "postgres",
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
      },
    }
  );

  new URL("./local", import.meta.url);

  // specify the path to the file, and create a buffer with characters we want to write
  let path = "/home/vaduga/Documents/pic.jpeg";

  // open the file in writing mode, adding a callback function where we do the actual writing
  fs.open(path, "w", async function (err, fd) {
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

export { SaveFromSequelize };
