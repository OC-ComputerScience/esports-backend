import db from "../models/index.js";
import matchDataUtils from "../sequelizeUtils/matchData.js";

const Op = db.Sequelize.Op;

const MatchData = db.matchData;

const exports = {};

// Create a new MatchData
exports.create = (req, res) => {
  const { value, metricId, matchId } = req.body;
  // Check if any of the required parameters are missing or empty
  if (!matchId || !metricId || value === undefined) {
    return res.status(400).json({
      message:
        "All parameters (matchId, metricId, value) are required and cannot be empty!",
    });
  }

  MatchData.create({ matchId, metricId, value })
    .then((matchData) => {
      res.status(201).json(matchData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unable to create MatchData" });
    });
};

// Get all MatchData for a specific match
exports.getAllForMatch = (req, res) => {
  const matchId = req.params.matchId;
  const filter = req.query.filter;
  const offset = req.query.pageSize * (req.query.page - 1) || 0;
  const limit = Number(req.query.pageSize) || 10; // Adjust the default limit as needed
  var condition;
  console.log(filter);
  if (filter == undefined || filter == "" || filter == null) {
    condition = { matchId: matchId };
  } else {
    condition = {
      matchId: matchId,
      [Op.or]: [
        { id: { [Op.like]: "%" + filter + "%" } },
        { value: { [Op.like]: "%" + filter + "%" } },
      ],
    };
  }
  matchDataUtils
    .findAllMatchDataWhere(condition, offset, limit)
    .then((matchData) => {
      res.send(matchData);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch MatchData" });
    });
};

// Get MatchData by ID
exports.getById = (req, res) => {
  const { id } = req.params;
  MatchData.findByPk(id)
    .then((matchData) => {
      if (!matchData) {
        return res.status(404).json({ error: "MatchData not found" });
      }
      res.status(200).json(matchData);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch MatchData" });
    });
};

// Update MatchData by ID
exports.update = (req, res) => {
  const { id } = req.params;

  MatchData.findByPk(id).then((matchData) => {
    if (!matchData) {
      return res.status(404).json({ error: "MatchData not found" });
    }

    const { matchId, metricId, value } = req.body;

    matchData.matchId = matchId;
    matchData.metricId = metricId;
    matchData.value = value;

    matchData
      .save()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Unable to update MatchData",
        });
      });
  });
};

// Delete MatchData by ID
exports.delete = (req, res) => {
  const { id } = req.params;
  MatchData.findByPk(id)
    .then((matchData) => {
      if (!matchData) {
        return res.status(404).json({ error: "MatchData not found" });
      } else {
        matchData.destroy();
        return res
          .status(200)
          .json({ message: "MatchData deleted successfully" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: err.message || "Unable to delete MatchData" });
    });
};

export default exports;
