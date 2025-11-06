const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgresql://postgres.hrwqpfnbghjfggnlleuo:nh1hv2Lfk9OVHFb2@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
  {
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
