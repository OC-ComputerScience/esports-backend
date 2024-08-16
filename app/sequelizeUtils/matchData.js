import db from "../models/index.js";
const MatchData = db.matchData;

const exports = {};

exports.findAllMatchDataWhere = async (condition, offset, limit) => {
  console.log("Fetching data:", condition, offset, limit);
  return await MatchData.findAndCountAll({
    where: condition,
    offset: offset,
    limit: limit,
    include: {
      model: db.metric,
      required: true,
      as: "metric",
    },
  });
};

export default exports;
