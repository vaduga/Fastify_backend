const db = require("../config/db.config.js");
const File = db.files;

exports.uploadToDB = (request, reply) => {
  File.create({
    type: request.file.mimetype,
    name: request.file.originalname,
    data: request.file.buffer,
  })
    .then(() => {
      reply.send({
        msg:
          "File uploaded successfully! -> filename = " +
          request.file.originalname,
      });
    })
    .catch(errorLog);
};

exports.listAllFiles = (request, reply) => {
  File.findAll({ attributes: ["id", "name"] })
    .then((files) => {
      reply.send(files);
    })
    .catch(errorLog);
};

exports.downloadFile = (request, reply) => {
  //// достаем файл из Postgres с помощью модели Sequalize вместо чистого sql-запроса
  File.findByPk(request.params.id)
    .then((file) => {
      let fileContents = Buffer.from(file.data, "base64");

      reply.header("Content-disposition", "attachment; filename=" + file.name);
      reply.type("Content-Type", file.type);

      reply.send(fileContents);
    })
    .catch(errorLog);
};

function errorLog(err) {
  console.log(err);
  reply.send({ msg: "Error", detail: err });
}
