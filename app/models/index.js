const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port:5432,
});

const db = {
    Sequelize:{},
    sequelize:{},
    leads:{}
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.leads = require("./leads.model")(sequelize, Sequelize);

module.exports = db;