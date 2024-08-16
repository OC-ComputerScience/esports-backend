import Match from "../sequelizeUtils/match.js";
import db from "../models/index.js";
const Op = db.Sequelize.Op;

const exports = {};
// Create a new Match
exports.create = async (req, res) => {
  await Match.createMatch(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the match.",
      });
    });
};

// Find one Match by ID
exports.findOne = async (req, res) => {
  await Match.findOneMatch(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find match with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving match with id = " + req.params.id,
      });
      console.log("Could not find match: " + err);
    });
};

// Find all Matches
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
  await Match.findAllMatchesWhere(condition, offset, limit)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving matches.",
      });
    });
};

// Update a Match by ID
exports.update = async (req, res) => {
  console.log(res.body);
  await Match.updateMatch(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Match was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update match with id = ${req.params.id}. Maybe match was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating match with id = " + req.params.id,
      });
      console.log("Could not update match: " + err);
    });
};

// Delete a Match by ID
exports.delete = async (req, res) => {
  await Match.deleteMatch(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Match was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete match with id = ${req.params.id}. Maybe match was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete match with id = " + req.params.id,
      });
      console.log("Could not delete match: " + err);
    });
};

export default exports;
