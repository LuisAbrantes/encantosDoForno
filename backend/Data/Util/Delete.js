//? DELETE PRODUCT
const DeleteProduct = async (table, id) => {
    try {
        const deletedCount = await table.destroy({
            where: { id: id }
        });
        return deletedCount;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

//? DELETE SCHEDULE
const DeleteSchedule = async (table, id) => {
    try {
        const deletedCount = await table.destroy({
            where: { id: id }
        });
        return deletedCount;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

//? DELETE PRODUCT CLASS
const DeleteProductClass = async (table, id) => {
    try {
        const deletedCount = await table.destroy({
            where: { id: id }
        });
        return deletedCount;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

//? DELETE EMPLOYEE
const DeleteEmployee = async (table, id) => {
    try {
        const deletedCount = await table.destroy({
            where: { id: id }
        });
        return deletedCount;
    } catch (ERR) {
        console.error(ERR);
        throw ERR;
    }
};

module.exports = {
    DeleteProduct,
    DeleteSchedule,
    DeleteProductClass,
    DeleteEmployee
};
