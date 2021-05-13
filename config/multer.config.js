//// для передачи бинарных данных чаще используется формат "multipart/form-data"
////  то есть данные собираются из input'ов форм и передаются многими частями (отдельно значения ключей, файл, или много файлов)
//// у формы надо указать enctype="multipart/form-data"

const fs = require("fs");
const multer = require("fastify-multer");
const storage = multer.memoryStorage();

// при загрузке проекта создадим папки для сохранения файлов (, т.к. в git их не храним)

let dir1 = require("path").join(__dirname, "..", "uploads");
let dir2 = require("path").join(__dirname, "..", "uploads", "sql");

fs.mkdir(dir1, (err) => console.log("err"));
fs.mkdir(dir2, (err) => console.log("err"));

// подключаем два вида объектов хранилищ multer - на диске и буффер в памяти.

const disk_upload = multer({ dest: "./uploads" });
const memory_upload = multer({ storage: storage });

module.exports = { disk_upload, memory_upload, multer };
