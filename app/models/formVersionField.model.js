import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FormField = SequelizeInstance.define("formVersionField", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fieldName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dataAttribute: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default FormField;
