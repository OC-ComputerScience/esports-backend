import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FacilityStation = SequelizeInstance.define("facilityStation", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  numSeats: {
    type: Sequelize.INTEGER,
  },
});

export default FacilityStation;
