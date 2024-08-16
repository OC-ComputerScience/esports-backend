import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Alias = SequelizeInstance.define("alias", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  aliasType: {
    type: Sequelize.ENUM("Primary", "Alternate"),
  },
  gamerTag: {
    type: Sequelize.STRING,
  },
});

export default Alias;
