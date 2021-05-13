const multer = require("fastify-multer");
const storage = multer.memoryStorage();

const disk_upload = multer({ dest: "./uploads" });
const memory_upload = multer({ storage: storage });

module.exports = { disk_upload, memory_upload, multer };
