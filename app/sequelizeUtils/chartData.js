import db from "../models/index.js";
import parseData from "./support/dataParser.js";

const MatchParticipant = db.matchParticipant;
const PlayerData = db.playerData;
const Metric = db.metric;
const Match = db.match;

const exports = {};

exports.findAllDataForPlayer = async (aliasId, metricId) => {
  const processedData = [];
  const playerData = await MatchParticipant.findAll({
    where: {
      aliasId: aliasId,
    },
    include: [
      {
        model: PlayerData,
        where: {
          metricId: metricId,
        },
        include: {
          model: Metric,
          attributes: ["dataType"],
        },
      },
      {
        model: Match,
        as: "match",
        attributes: ["matchDate"],
      },
    ],
  });

  playerData.forEach((player) => {
    const date = player.match.matchDate;

    player.playerData.forEach((dataPoint) => {
      const processedPoint = {
        value: parseData(dataPoint.value, dataPoint.metric.dataType),
        matchDate: date,
      };
      processedData.push(processedPoint);
    });
  });
  return processedData;
};

export default exports;
