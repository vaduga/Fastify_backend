const multer = require("fastify-multer");
const storage = multer.memoryStorage();

const upload = multer({ dest: "./uploads", storage: storage });

module.exports = { upload, multer };
