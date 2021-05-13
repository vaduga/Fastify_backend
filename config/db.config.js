const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URI, {
  /// новое подключение
  dialect: "postgres",
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.files = require("../models/file.model.js")(sequelize, Sequelize); /// модель данных создается из функции, которая принимает подключения sequelize
/// , и самой библиотеки Sequelize для указания типов данных в модели (String, Int и т.д.)
module.exports = db;
