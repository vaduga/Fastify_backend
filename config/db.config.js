const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.files = require("../models/file.model.js")(sequelize, Sequelize);

module.exports = db;
