import db from "../models/index.js";
const Team = db.team;

const exports = {};

exports.createTeam = async (team) => {
  // Validate name
  if (!team.name) {
    throw new Error("Team name can't be empty");
  } else if (!team.titleId) {
    throw new Error("Team titleId can't be empty");
  }

  return await Team.create(team);
};

exports.findOneTeam = async (id) => {
  return await Team.findByPk(id);
};

exports.findAllTeamsWhere = async (condition, offset, limit) => {
  return await Team.findAndCountAll({
    where: condition,
    offset: offset,
    limit: limit,
  });
};

exports.updateTeam = async (team, id) => {
  if (!team.name) {
    throw new Error("Team name can't be empty");
  } else if (!team.titleId) {
    throw new Error("Team titleId can't be empty");
  }

  return await Team.update(team, { where: { id: id } });
};
exports.deleteTeam = async (id) => {
  return await Team.destroy({ where: { id: id } });
};

export default exports;
