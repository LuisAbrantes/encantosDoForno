const Sequelize = require("sequelize"); 

const sequelize = new Sequelize(
  "postgresql://postgres.gjyakmgtkmmeqqgdxavo:6TSPKZ0qZcJEAQXI@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
  {
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;