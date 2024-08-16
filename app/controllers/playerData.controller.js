import db from "../models/index.js";

const Op = db.Sequelize.Op;

const PlayerData = db.playerData;
const Metric = db.metric;

const exports = {};

// Create a new PlayerData entry
exports.create = (req, res) => {
  const { value, metricId, participantId } = req.body;

  if (!value || !metricId || !participantId) {
    return res.status(400).json({
      message:
        "All parameters (value, metricId, participantId) are required and cannot be empty!",
    });
  }

  PlayerData.create({ value, metricId, participantId })
    .then((playerData) => {
      res.status(201).json(playerData);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to create PlayerData" });
    });
};

// Retrieve a specific PlayerData entry by ID
exports.findOne = (req, res) => {
  const playerId = req.params.id;

  PlayerData.findByPk(playerId)
    .then((playerData) => {
      if (!playerData) {
        return res.status(404).json({ message: "PlayerData not found" });
      }
      res.status(200).json(playerData);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to retrieve PlayerData" });
    });
};

// Update an existing PlayerData entry by ID
exports.update = (req, res) => {
  const playerId = req.params.id;
  const { value, metricId, participantId } = req.body;

  PlayerData.findByPk(playerId)
    .then((playerData) => {
      if (!playerData) {
        return res.status(404).json({ message: "PlayerData not found" });
      }

      playerData.value = value;
      playerData.metricId = metricId;
      playerData.participantId = participantId;

      return playerData.save();
    })
    .then((updatedPlayerData) => {
      res.status(200).json(updatedPlayerData);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to update PlayerData" });
    });
};

// Delete a PlayerData entry by ID
exports.delete = (req, res) => {
  const playerId = req.params.id;

  PlayerData.findByPk(playerId)
    .then((playerData) => {
      if (!playerData) {
        return res.status(404).json({ message: "PlayerData not found" });
      }

      return playerData.destroy();
    })
    .then(() => {
      res.status(200).send({ message: "PlayerData deleted successfully" }); // No content, successful deletion
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to delete PlayerData" });
    });
};

// Find all PlayerData entries for a specific participant
exports.findAllForParticipant = async (req, res) => {
  const participantId = req.params.participantId;

  const { page, pageSize } = req.query;
  const filter = req.query.filter || "";

  const offset = (page - 1) * pageSize;
  const limit = Number(pageSize) || 10;

  const whereCondition = {
    participantId: participantId,
  };

  try {
    const playerData = await PlayerData.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      include: {
        model: Metric,
        attributes: ["name"],
        where: {
          name: {
            [Op.like]: `%${filter}%`,
          },
        },
      },
    });

    const formattedResponse = {
      rows: [],
      count: playerData.count,
    };

    formattedResponse.rows = playerData.rows.map((data) => ({
      id: data.id,
      value: data.value,
      metricId: data.metricId,
      metricName: data.metric.name,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to retrieve PlayerData" });
  }
};

export default exports;
