//? EDIT PRODUCT
const EditProduct = async (table, id, dataJson) => {
    try {
        const updatedData = await table.update(
            {
                Product_Name: dataJson.Product_Name,
                Product_Price: dataJson.Product_Price,
                Product_Weight: dataJson.Product_Weight,
                productClassId: Number(dataJson.Product_Class)
            },
            {
                where: { id: id }
            }
        );
        return updatedData;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

//? EDIT SCHEDULE
const EditSchedule = async (table, id, dataJson) => {
    try {
        const updatedData = await table.update(
            {
                Date: dataJson.Date,
                HM_Peoples: dataJson.Peoples,
                Number_to_Contact: dataJson.Number
            },
            {
                where: { id: id }
            }
        );
        return updatedData;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

//? EDIT PRODUCT CLASS
const EditProductClass = async (table, id, dataJson) => {
    try {
        const updatedData = await table.update(
            {
                Name: dataJson.Name
            },
            {
                where: { id: id }
            }
        );
        return updatedData;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

//? EDIT EMPLOYEE
const EditEmployee = async (table, id, dataJson) => {
    try {
        const updatedData = await table.update(
            {
                Employed_Name: dataJson.Employed_Name,
                Employed_Email: dataJson.Employed_Email,
                Employed_Password: dataJson.Employed_Password
            },
            {
                where: { id: id }
            }
        );
        return updatedData;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

module.exports = {
    EditProduct,
    EditSchedule,
    EditProductClass,
    EditEmployee
};
