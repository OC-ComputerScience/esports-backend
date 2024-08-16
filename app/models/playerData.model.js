import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const PlayerData = SequelizeInstance.define("playerData", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default PlayerData;
