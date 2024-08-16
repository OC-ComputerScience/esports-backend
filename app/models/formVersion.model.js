import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FormVersion = SequelizeInstance.define("formVersion", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  versionNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  source: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  effectiveDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  expireDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  requireDirectorSig: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

export default FormVersion;
