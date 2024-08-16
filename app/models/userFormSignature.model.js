import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FormSignature = SequelizeInstance.define("userFormSignature", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dateSigned: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  fontSelection: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  directorUserId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  directorDateSigned: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  directorFontSelection: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default FormSignature;
