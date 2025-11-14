//? FRAMEWORKS REQUIREMENT
const express = require("express");
const router = express.Router();

//? TABLES REQUIREMENT
const Employees = require("../Data/Tables/Employees");
const Line = require("../Data/Tables/Line");
const Products = require("../Data/Tables/Products");
const Schedules = require("../Data/Tables/Schedules");

const HTMLERRORMAKER = (add) => {
  const ERRORhtml = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Div Centralizada</title>
            
            <style>
                /* Estes estilos no <body> são para centralizar a div 
                na página (Requisito 4) 
                */
                body {
                    display: flex;
                    justify-content: center; /* Centraliza horizontalmente */
                    align-items: center;   /* Centraliza verticalmente */
                    min-height: 100vh;     /* Altura total da tela */
                    margin: 0;             /* Remove margens padrão */
                    background-color: #222222ff; /* Um fundo leve para a página */
                    font-family: sans-serif;
                }

                /* Estes são os estilos da sua div 
                */
                .minha-div {
                    /* 1. Fundo cinza */
                    background-color: #ffffffff;
                    
                    /* 2. Borda de cima vermelha */
                    border-top: 8px solid #8a0f0fff;
                    
                    /* 3. Bordas redondas */
                    border-radius: 10px;
                    
                    /* 6. Adaptar ao conteúdo (e espaçamento interno) */
                    width: fit-content; /* A largura se ajusta ao texto */
                    padding: 25px;      /* Espaço entre o texto e as bordas */
                    
                    /* Segurança: Define uma largura máxima */
                    max-width: 90%; 
                }
            </style>
        </head>
            <body>
            <div class="minha-div">
            ${add}            
            </div>

            </body>
        </html>
        `;
  return ERRORhtml;
};
//? API
router.get("/", (req, res) => {
  try {
    res.send(`
        <form method="POST" action="http://localhost:3000/api/post/products">
            <input type="text" name="Product_Name" placeholder="Nome do Produto"><br>
            <input type="text" name="Product_Price" placeholder="Preço do Produto"><br>
            <input type="text" name="Product_Weight" placeholder="Peso do Produto">
            <p>Tipo do Produto</p>
            <select name="Product_Class">
                <option value="Sobremesa">Sobremesa</option>
                <option value="ETC">ETC</option>
            </select><br>
            <button type="submit">Enviar</button>
        </form>
        `);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});
//? GET ALL PRODUCTS
router.get("/api/products", async (req, res) => {
  try {
    const AllProductData = await Products.findAll();
    res.json(AllProductData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL PRODUCTS
//! FILTERED CLASS
router.get("/api/products/:class", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      where: { Product_Class: `${req.params.class}` },
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE LOW↓ TO HIGH↑
router.get("/api/products/order/lowtohigh", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      order: [["Product_Price", "ASC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE HIGH↑ TO LOW↓
router.get("/api/products/order/hightolow", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      order: [["Product_Price", "DESC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE LOW↓ TO HIGH↑ & CLASS
router.get("/api/products/order/lowtohigh/:class", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      where: {
        Product_Class: `${req.params.class}`,
      },
      order: [["Product_Price", "ASC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE HIGH↑ TO LOW↓ & CLASS
router.get("/api/products/order/hightolow/:class", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      where: {
        Product_Class: `${req.params.class}`,
      },
      order: [["Product_Price", "DESC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL EMPLOYEES
router.get("/api/employees", async (req, res) => {
  try {
    const AllEmployeesData = await Employees.findAll();
    res.json(AllEmployeesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL SCHEDULES
router.get("/api/schedules", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll();
    res.json(AllSchedulesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL SCHEDULES
//! FILTERED DATA LOW↓ TO HIGH↑
router.get("/api/schedules/order/lowtohigh", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll({
      order: [["Date", "ASC"]],
    });
    res.json(AllSchedulesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL SCHEDULES
//! FILTERED DATA HIGH↑ TO LOW↓
router.get("/api/schedules/order/hightolow", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll({
      order: [["Date", "DESC"]],
    });
    res.json(AllSchedulesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL LINE
router.get("/api/line", async (req, res) => {
  try {
    const AllLineData = await Line.findAll();
    res.json(AllLineData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL LINE
//! FILTERED POSITION HIGH↑ TO LOW↓
router.get("/api/line/order/hightolow", async (req, res) => {
  try {
    const AllLineData = await Line.findAll({ order: [["Position", "DESC"]] });
    res.json(AllLineData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

//? GET ALL LINE
//! FILTERED POSITION LOW↓ TO HIGH↑
router.get("/api/line/order/lowtohigh", async (req, res) => {
  try {
    const AllLineData = await Line.findAll({ order: [["Position", "ASC"]] });
    res.json(AllLineData);
  } catch (ERR) {
    console.error(ERR);
    res.send(HTMLERRORMAKER(ERR));
  }
});

module.exports = router;
