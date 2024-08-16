import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const User = SequelizeInstance.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fName: {
    type: Sequelize.STRING,
  },
  lName: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  shirtSize: {
    type: Sequelize.STRING,
  },
  pantSize: {
    type: Sequelize.STRING,
  },
  outsidePC: {
    type: Sequelize.BOOLEAN,
  },
  fullVacc: {
    type: Sequelize.BOOLEAN,
  },
  classification: {
    type: Sequelize.ENUM(
      "Freshman",
      "Sophmore",
      "Junior",
      "Senior",
      "Graduate",
    ),
  },
  expectedGradDate: {
    type: Sequelize.DATE,
  },
  activePlayer: {
    type: Sequelize.BOOLEAN,
  },
  dateSignedAgreement: {
    type: Sequelize.DATE,
  },
  accountUpToDate: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default User;
