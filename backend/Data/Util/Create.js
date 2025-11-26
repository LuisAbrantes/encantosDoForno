//? CREATE PRODUCT
const CreateProduct = async (table, dataJson) => {
  try {
    console.error(dataJson);
    const newData = await table.create({
      Product_Name: dataJson.Product_Name,
      Product_Price: dataJson.Product_Price,
      Product_Weight: dataJson.Product_Weight,
      productClassId: Number(dataJson.Product_Class),
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
      Date: dataJson.Date,
      HM_Peoples: dataJson.Peoples,
      Number_to_Contact: dataJson.Number,
    });
    return newData;
  } catch (ERR) {
    console.error(ERR);
    return ERR;
  }
};

//? CREATE SCHEDULE
const CreateProductClass = async (table, dataJson) => {
  try {
    console.error(dataJson);
    const newData = await table.create({
      Name: dataJson.Name,
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
      Employed_Name: dataJson.Employed_Name,
      Employed_Email: dataJson.Employed_Email,
      Employed_Password: dataJson.Employed_Password,
    });
    return newData;
  } catch (ERR) {
    console.error(ERR);
    return ERR;
  }
};

module.exports = {
  CreateProduct,
  CreateEmployed,
  CreateSchedule,
  CreateProductClass,
};
