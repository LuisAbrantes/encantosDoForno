//? CREATE PRODUCT
const CreateProduct = async (table, dataJson) => {
  try {
    console.error(dataJson);
    const newData = await table.create({
      Product_Name: dataJson.Product_Name,
      Product_Price: dataJson.Product_Price,
      Product_Weight: dataJson.Product_Weight,
      Product_Class: dataJson.Product_Class,
    });
    return newData;
  } catch (ERR) {
    console.error(ERR);
    return ERR;
  }
};

//? CREATE SCHEDULE
const CreateSchedule = async (table, dataJson) => {
  try {
    console.error(dataJson);
    const newData = await table.create({
      Product_Name: dataJson.Product_Name,
      Product_Price: dataJson.Product_Price,
      Product_Weight: dataJson.Product_Weight,
      Product_Class: dataJson.Product_Class,
    });
    return newData;
  } catch (ERR) {
    console.error(ERR);
    return ERR;
  }
};

//? CREATE LINE
const CreateLine = async (table, dataJson) => {
  try {
    console.error(dataJson);
    const newData = await table.create({
      Product_Name: dataJson.Product_Name,
      Product_Price: dataJson.Product_Price,
      Product_Weight: dataJson.Product_Weight,
      Product_Class: dataJson.Product_Class,
    });
    return newData;
  } catch (ERR) {
    console.error(ERR);
    return ERR;
  }
};

//? CREATE EMPLOYED
const CreateEmployed = async (table, dataJson) => {
  try {
    console.error(dataJson);
    const newData = await table.create({
      Product_Name: dataJson.Product_Name,
      Product_Price: dataJson.Product_Price,
      Product_Weight: dataJson.Product_Weight,
      Product_Class: dataJson.Product_Class,
    });
    return newData;
  } catch (ERR) {
    console.error(ERR);
    return ERR;
  }
};

module.exports = { CreateProduct, CreateEmployed, CreateLine, CreateSchedule };
