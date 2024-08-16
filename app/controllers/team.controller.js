import db from "../models/index.js";
import Team from "../sequelizeUtils/team.js";
const Op = db.Sequelize.Op;

const exports = {};

// Create a new team
exports.create = async (req, res) => {
  await Team.createTeam(req.body)
    .then(() => {
      res.status(200).send({ message: "Team was created successfully" });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Something went wrong while creating a team",
      });
    });
};

// Update an existing team
exports.update = async (req, res) => {
  await Team.updateTeam(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: "Team was updated successfully",
        });
      } else {
        res.status(404).send({
          message: "Team was not found",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Something went wrong while updating a team",
      });
    });
};

// Delete a team
exports.delete = async (req, res) => {
  await Team.deleteTeam(req.params.id)
    .then((num) => {
      if (num === 1) {
        res.send({ message: "Team was deleted successfully." });
      } else {
        res.status(404).send({
          message: "Team not found or unable to delete.",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message:
          err.message || "Something went wrong trying to delete this team",
      });
    });
};

exports.findOne = (req, res) => {
  Team.findOneTeam(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find team with id of " + req.params.id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Something went wrong deleting team with id of " + req.params.id,
      });
    });
};

exports.findAll = async (req, res) => {
  const id = req.query.id;
  const name = req.query.name;
  const filter = req.query.filter;
  const offset = req.query.pageSize * (req.query.page - 1) || 0;
  const limit = Number(req.query.pageSize) || 10; // Adjust the default limit as needed
  var condition;
  if (filter == undefined || filter == "" || filter == null) {
    condition = id
      ? { id: { [Op.like]: `%${id}%` } }
      : name
      ? { name: { [Op.like]: `%${name}%` } }
      : null;
  } else {
    condition = {
      [Op.or]: [
        { id: { [Op.like]: "%" + filter + "%" } },
        { name: { [Op.like]: "%" + filter + "%" } },
      ],
    };
  }
  Team.findAllTeamsWhere(condition, offset, limit)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving teams.",
      });
    });
};

export default exports;
