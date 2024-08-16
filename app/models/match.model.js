import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Match = SequelizeInstance.define("match", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  matchDate: {
    type: Sequelize.DATEONLY,
  },
  matchIsWin: {
    type: Sequelize.BOOLEAN,
  },
});

export default Match;
