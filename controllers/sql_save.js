const fs = require("fs");

const db = require("../config/db.config");

async function SQL_SaveFromPostgres(request, reply) {
  // specify the path to the file, and create a buffer with characters we want to write
  let dir = require("path").join(__dirname, "..", "uploads", "sql");

  let filename = dir + "/pic.jpg";

  let buffer = await db.sequelize.query(
    "SELECT * FROM orders WHERE customer=1"
  );
  buffer = buffer[0][1].pic;

  // открыть файл на чтение и запустить запись в file destination (fd) из буфера
  fs.open(filename, "w", async function (err, fd) {
    if (err) {
      throw "could not open file: " + err;
    }

    // пишем с 0 байта по последний
    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      if (err) throw "error writing file: " + err;
      fs.close(fd, function () {
        /// закрыть файл на чтение
        console.log("wrote the file successfully");
      });
    });
  });

  /// ответ сервера (fastify)
  reply.type("text/html").send(`            
    <p>Some demo file requested with SQL-query and save to: ${filename} </p>
    <a href="/api/main"><button>Back</button></a>
    `);
}

module.exports = SQL_SaveFromPostgres;
