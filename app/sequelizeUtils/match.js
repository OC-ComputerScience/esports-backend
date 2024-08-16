import db from "../models/index.js";
const Match = db.match;
const Team = db.team;

const exports = {};

exports.createMatch = async (matchData) => {
  if (matchData.teamId === undefined) {
    const error = new Error("Team ID cannot be empty for match!");
    throw error;
  }
  if (matchData.matchDate === undefined) {
    const error = new Error("Match Date cannot be empty for match!");
    throw error;
  }
  if (matchData.matchIsWin === undefined) {
    const error = new Error("matchIsWin cannot be empty for match!");
    throw error;
  }

  await Team.findByPk(matchData.teamId)
    .then((data) => {
      if (data == null) {
        throw new Error("Failed to find Team with id: " + matchData.teamId);
      } else {
        console.log("Team found");
      }
    })
    .catch((err) => {
      const error = new Error(err.message);
      throw error;
    });

  // Create a match
  const match = {
    id: matchData.id,
    name: matchData.name,
    teamId: matchData.teamId,
    matchDate: matchData.matchDate,
    matchIsWin: matchData.matchIsWin,
  };

  // Save match in the database
  return await Match.create(match);
};

exports.findOneMatch = async (id) => {
  return await Match.findOne({
    where: { id: id },
    include: {
      model: db.team,
      required: true,
      as: "team",
    },
  });
};

exports.findAllMatchesWhere = async (condition, offset, limit) => {
  return await Match.findAndCountAll({
    where: condition,
    offset: offset,
    limit: limit,
  });
};

exports.updateMatch = async (match, id) => {
  return await Match.update(match, { where: { id: id } });
};

exports.deleteMatch = async (id) => {
  return await Match.destroy({
    where: { id: id },
  });
};

export default exports;
