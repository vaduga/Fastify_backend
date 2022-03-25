const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'postgres://trtmlpgshwofaq:92b2ea3d96b853d3423efbc7ba49b94f5c9dee4200e8c325251fa30437a6f4fa@ec2-52-19-164-214.eu-west-1.compute.amazonaws.com:5432/daq7bh988dhuup',
  {
    /// новое подключение
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.files = require('../models/file.model.js')(sequelize, Sequelize); /// модель данных создается из функции, которая принимает подключения sequelize
/// , и самой библиотеки Sequelize для указания типов данных в модели (String, Int и т.д.)
module.exports = db;
