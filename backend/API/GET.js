//? FRAMEWORKS REQUIREMENT
const express = require("express");
const router = express.Router();

//? TABLES REQUIREMENT
const Employees = require("../Data/Tables/Employees");
const Products = require("../Data/Tables/Products");
const Schedules = require("../Data/Tables/Schedules");
const ProductClasses = require("../Data/Tables/ProductClass");

const HTMLERRORMAKER = (add) => {
  const ERRORhtml = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Div Centralizada</title><style>body {display: flex;justify-content: center; /* Centraliza horizontalmente */align-items: center;   /* Centraliza verticalmente */min-height: 100vh;     /* Altura total da tela */margin: 0;             /* Remove margens padrão */background-color: #222222ff; /* Um fundo leve para a página */font-family: sans-serif;}.minha-div {background-color: #ffffffff;border-top: 8px solid #8a0f0fff;border-radius: 10px;width: fit-content;padding: 25px;max-width: 90%; }</style></head><body><div class="minha-div">${add}</div></body></html>`;
  return ERRORhtml;
};
//? API
router.get("/api", async (req, res) => {
  try {
    const classesall = await ProductClasses.findAll({});
    const productsall = await Products.findAll({});
    const scheduleall = await Schedules.findAll({});
    const employedall = await Employees.findAll({});

    let optionsHtml = "";
    classesall.forEach((classItem) => {
      optionsHtml += `<option value="${classItem.id}">${classItem.Name}</option>`;
    });
    let editproductHtml = "";
    productsall.forEach((productedit) => {
      editproductHtml += `<option value="${productedit.id}">${productedit.id} - ${productedit.Product_Name}</option>`;
    });

    let productEDehtml = "";
    productsall.forEach((productED) => {
      productEDehtml += `
      <p>Nome : ${productED.Product_Name}</p>
      <p>Preço : ${productED.Product_Price}</p>
      <p>Peso : ${productED.Product_Weight}</p>
      <p>Classe : ${productED.productClassId}</p>
      <p style="color:red" onclick="Delete(${productED.id},'http://localhost:3000/delete/product/${productED.id}')">Delete</p>`;
    });

    let employedEDehtml = "";
    employedall.forEach((employedED) => {
      employedEDehtml += `
      <p>Nome : ${employedED.Employed_Name}</p>
      <p>Email : ${employedED.Employed_Email}</p>
      <p>Senha : ${employedED.Employed_Password}</p>
      <p style="color:red" onclick="Delete(${employedED.id},'http://localhost:3000/delete/employed/${employedED.id}')">Delete</p>`;
    });

    let classDEhtml = "";
    classesall.forEach((classDE) => {
      classDEhtml += `
      <p>Nome : ${classDE.Name}</p>
      <p style="color:red" onclick="Delete(${classDE.id},'http://localhost:3000/delete/class/${classDE.id}')">Delete</p>
      <p style="color:blue" onclick="Edit(${classDE.id},'http://localhost:3000/edit/class/${classDE.id}')">Edit</p>`;
    });

    let scheduleEDehtml = "";
    scheduleall.forEach((scheduleED) => {
      scheduleEDehtml += `
      <p>Data : ${scheduleED.Date}</p>
      <p>Pessoas : ${scheduleED.HM_Peoples}</p>
      <p>Telefone para Contato : ${scheduleED.Number_to_Contact}</p>
      <p style="color:red" onclick="Delete(${scheduleED.id},'http://localhost:3000/delete/schedule/${scheduleED.id}')">Delete</p>`;
    });

    res.send(`
    <h1>POST</h1> 
      Produtos
        <form method="POST" action="http://localhost:3000/api/post/products">
            <input type="text" name="Product_Name" placeholder="Nome do Produto"required><br>
            <input type="text" name="Product_Price" placeholder="Preço do Produto"required><br>
            <input type="text" name="Product_Weight" placeholder="Peso do Produto"required><br>
            <select name="Product_Class"required>
            ${optionsHtml}
            </select>
            <br>
            <button type="submit">Enviar</button>
        </form>
      <hr>
      Classe de Produto
        <form method="POST" action="http://localhost:3000/api/post/productclass">
            <input type="text" name="Name" placeholder="Classe do Produto" required><br>
            <button type="submit">Enviar</button>
        </form>
      <hr>
      Agendamentos
        <form method="POST" action="http://localhost:3000/api/post/schedules">
            <input type="date" name="Date"><br>
            <input type="text" name="Peoples" placeholder="Numero de pessoas"required><br>
            <input type="text" name="Number" placeholder="Numero para contato"required><br>
            <button type="submit">Enviar</button>
        </form>
      <hr>
      Empregados
        <form method="POST" action="http://localhost:3000/api/post/employed">
            <input type="text" name="Employed_Name" placeholder="Nome do Empregado"required><br>
            <input type="text" name="Employed_Email" placeholder="Email do Empregado"required><br>
            <input type="text" name="Employed_Password" placeholder="Senha do Empregado"required><br>
            <button type="submit">Enviar</button>
        </form>

    <h1>DELETE</h1>
      Produtos
        ${productEDehtml}
      <hr>
      Agendamentos
        ${scheduleEDehtml}
      <hr>
      Classes
        ${classDEhtml}
      <hr>
      Empregados
        ${employedEDehtml}


    <h1>EDIT</h1>
      Produtos
        <br>
        <form method="POST" action="http://localhost:3000/api/edit/product>
          <input type="text"><br>
          <select name="id">
            ${editproductHtml}
          </select><br>
          <input type="text" name="Product_Name" placeholder="Nome do Produto"required><br>
          <input type="text" name="Product_Price" placeholder="Preço do Produto"required><br>
          <input type="text" name="Product_Weight" placeholder="Peso do Produto"required><br>
          <select name="Product_Class"required>
          ${optionsHtml}
          </select>
          <br>
          <button type="submit" >Enviar</button>
        </form>
    
          

    <script>
      const Delete=async(id,url)=>{
        const response = await fetch(url, {
            method: 'DELETE' 
        });
      }
      const Edit=async(id,url,dataJson)=>{
        }
    </script>    
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

module.exports = router;
