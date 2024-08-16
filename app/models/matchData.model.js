import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const MatchData = SequelizeInstance.define("matchdata", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  value: {
    type: Sequelize.STRING, // You can change the data type to match your data
  },
});

export default MatchData;
