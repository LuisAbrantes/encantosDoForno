//? FRAMEWORKS REQUIREMENT
const express = require("express");
const router = express.Router();

//? USEFUL REQUIREMENT
const CreateData = require("../Data/Util/Create");

//? TABLES REQUIREMENT
const Employees = require("../Data/Tables/Employees");
const Products = require("../Data/Tables/Products");
const Schedules = require("../Data/Tables/Schedules");
const ProductClasses = require("../Data/Tables/ProductClass");

const HTMLERRORMAKER = (add) => {
  const ERRORhtml = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Div Centralizada</title><style>body {display: flex;justify-content: center; /* Centraliza horizontalmente */align-items: center;   /* Centraliza verticalmente */min-height: 100vh;     /* Altura total da tela */margin: 0;             /* Remove margens padrão */background-color: #222222ff; /* Um fundo leve para a página */font-family: sans-serif;}.minha-div {background-color: #ffffffff;border-top: 8px solid #8a0f0fff;border-radius: 10px;width: fit-content;padding: 25px;max-width: 90%; }</style></head><body><div class="minha-div">${add}</div></body></html>`;
  return ERRORhtml;
};

//? CREATE NEW PRODUCT
router.post("/api/post/products", async (req, res) => {
  try {
    console.error(req.body);
    const newDataList = req.body;
    console.log("newDataList =" + newDataList);
    const newData = await CreateData.CreateProduct(Products, req.body);
    res.send("OK");
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? CREATE NEW SCHEDULE
router.post("/api/post/schedules", async (req, res) => {
  try {
    console.error(req.body);
    const newDataList = req.body;
    console.log("newDataList =" + newDataList);
    const newData = await CreateData.CreateSchedule(Schedules, req.body);
    res.send("OK");
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? CREATE NEW EMPLOYED
router.post("/api/post/employed", async (req, res) => {
  try {
    console.error(req.body);
    const newDataList = req.body;
    console.log("newDataList =" + newDataList);
    const newData = await CreateData.CreateEmployed(Employees, req.body);
    res.send("OK");
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? CREATE NEW PRODUCT CLASS
router.post("/api/post/productclass", async (req, res) => {
  try {
    console.error(req.body);
    const newDataList = req.body;
    console.log("newDataList =" + newDataList);
    const newData = await CreateData.CreateProductClass(
      ProductClasses,
      req.body
    );
    res.send("DATA RECIVED<br><a href='/api'>Voltar</a>");
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

module.exports = router;
