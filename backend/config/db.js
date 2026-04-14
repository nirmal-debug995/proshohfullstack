import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "proshop",
  process.env.DB_USER || "proshopuser",
  process.env.DB_PASS || "StrongP@Ss123",
  {
    host: process.env.DB_HOST || "20.244.47.247",
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
