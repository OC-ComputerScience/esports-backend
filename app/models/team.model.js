import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Team = SequelizeInstance.define("team", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  isFlagship: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  teamColor: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default Team;
