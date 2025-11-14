//? FRAMEWORKS REQUIREMENT
const express = require("express");
const router = express.Router();

//? USEFUL REQUIREMENT
const CreateData = require("../Data/Util/Create");

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

module.exports = router;
