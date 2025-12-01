const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const database = require("../config");

const Employees = database.define("Employees", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  Employed_Name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Employed_Email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  Employed_Password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('admin', 'employee'),
    defaultValue: 'employee',
    allowNull: false,
  },
}, {
  hooks: {
    beforeCreate: async (employee) => {
      if (employee.Employed_Password) {
        const salt = await bcrypt.genSalt(10);
        employee.Employed_Password = await bcrypt.hash(employee.Employed_Password, salt);
      }
    },
    beforeUpdate: async (employee) => {
      if (employee.changed('Employed_Password')) {
        const salt = await bcrypt.genSalt(10);
        employee.Employed_Password = await bcrypt.hash(employee.Employed_Password, salt);
      }
    },
  },
});

/**
 * Verifica se a senha fornecida corresponde à senha hasheada
 * @param {string} password - Senha em texto plano
 * @returns {Promise<boolean>}
 */
Employees.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.Employed_Password);
};

module.exports = Employees;
