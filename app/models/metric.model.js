import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Metric = SequelizeInstance.define("metric", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  metricType: {
    type: Sequelize.ENUM("Match", "Player"),
    allowNull: false,
  },
  dataType: {
    type: Sequelize.ENUM("Integer", "Float"),
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
});

export default Metric;
