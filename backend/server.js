const express = require("express");
const GET = require("./API/GET");
const POST = require("./API/POST");
const DELETE = require("./API/DELETE");
const EDIT = require("./API/EDIT");
const chalk = require("chalk");
const cl = console.log;
const blue = chalk.blue;
const red = chalk.red;
const green = chalk.green;
const black = chalk.black;

(async () => {
  const database = require("./Data/config");

  //? Tables Requirements
  const Employees = require("./Data/Tables/Employees");
  const Products = require("./Data/Tables/Products");
  const Schedules = require("./Data/Tables/Schedules");

  //? Database Sync | SUPABASE⚡
  await database.sync({ force: false });
  cl(chalk.bgWhite("\nBanco sincronizado com sucesso ✅ "));
})();

const app = express();

//? Preferences
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? Uses GET,POST & DELETE Routes
app.use(GET);
app.use(POST);
app.use(DELETE);
app.use(EDIT);

//? Booting the Server
app.listen(3000, () =>
  cl(blue("\nServidor runnning in ") + red("http://localhost:3000"))
);
