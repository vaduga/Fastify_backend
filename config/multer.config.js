//// для передачи бинарных данных чаще используется формат "multipart/form-data"
////  то есть данные собираются из input'ов форм и передаются многими частями (отдельно значения ключей, файл, или много файлов)
//// у формы надо указать enctype="multipart/form-data"

const fs = require("fs");
const path = require("path");
const multer = require("fastify-multer");
const memStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+"-"+ Date.now()+path.extname(file.originalname))
    } })

// при загрузке проекта создадим папки для сохранения файлов (, т.к. в git их не храним)

let dir1 = require("path").join(__dirname, "..", "uploads");
let dir2 = require("path").join(__dirname, "..", "uploads", "sql");

fs.mkdir(dir1, (err) => console.log("err:"+err));
fs.mkdir(dir2, (err) => console.log("err:"+err));

// подключаем два вида объектов хранилищ multer - на диске и буффер в памяти.

const disk_upload = multer({ storage: diskStorage});
const memory_upload = multer({ storage: memStorage });

module.exports = { disk_upload, memory_upload, multer };
