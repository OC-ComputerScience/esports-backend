import db from "../models/index.js";

const MatchParticipant = db.matchParticipant;
const Alias = db.alias;

const Op = db.Sequelize.Op;

const exports = {};

// Create a new MatchParticipant entry
exports.create = (req, res) => {
  const { aliasId, matchId } = req.body;

  if (!aliasId || !matchId) {
    return res.status(400).json({
      message:
        "All parameters (aliasId, matchId) are required and cannot be empty!",
    });
  }

  MatchParticipant.create({ aliasId, matchId })
    .then((matchParticipant) => {
      res.status(201).json(matchParticipant);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to create MatchParticipant" });
    });
};

// Retrieve a specific MatchParticipant entry by ID
exports.findOne = (req, res) => {
  const matchParticipantId = req.params.id;

  MatchParticipant.findByPk(matchParticipantId, {
    include: {
      model: Alias,
      attributes: ["gamerTag"], // Include only specified fields
    },
  })
    .then((matchParticipant) => {
      if (!matchParticipant) {
        return res.status(404).json({ message: "MatchParticipant not found" });
      }
      res.status(200).json(matchParticipant);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to retrieve MatchParticipant" });
    });
};

// Update an existing MatchParticipant entry by ID
exports.update = (req, res) => {
  const matchParticipantId = req.params.id;
  const { aliasId, matchId } = req.body;

  MatchParticipant.findByPk(matchParticipantId)
    .then((matchParticipant) => {
      if (!matchParticipant) {
        return res.status(404).json({ message: "MatchParticipant not found" });
      }

      matchParticipant.aliasId = aliasId;
      matchParticipant.matchId = matchId;

      return matchParticipant.save();
    })
    .then((updatedMatchParticipant) => {
      res.status(200).json(updatedMatchParticipant);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to update MatchParticipant" });
    });
};

// Delete a MatchParticipant entry by ID
exports.delete = (req, res) => {
  const matchParticipantId = req.params.id;

  MatchParticipant.findByPk(matchParticipantId)
    .then((matchParticipant) => {
      if (!matchParticipant) {
        return res.status(404).json({ message: "MatchParticipant not found" });
      }

      return matchParticipant.destroy();
    })
    .then(() => {
      res
        .status(200)
        .send({ message: "MatchParticipant deleted successfully" }); // No content, successful deletion
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to delete MatchParticipant" });
    });
};

// Find all MatchParticipant entries for a specific user (assuming you have a "userId" field)
exports.findAllForAlias = (req, res) => {
  const aliasId = req.params.aliasId;

  MatchParticipant.findAll({
    where: { aliasId: aliasId },
  })
    .then((matchParticipants) => {
      if (!matchParticipants || matchParticipants.length === 0) {
        return res
          .status(404)
          .json({ message: "No MatchParticipants found for this alias" });
      }
      res.status(200).json(matchParticipants);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to retrieve MatchParticipants" });
    });
};

// Find all MatchParticipants for a specific match
exports.findAllForMatch = async (req, res) => {
  const matchId = req.params.matchId;

  const { page, pageSize } = req.query;

  console.log(req.query.pageSize);
  console.log(req.query.filter);
  const filter = req.query.filter || "";

  const offset = (page - 1) * pageSize;
  const limit = Number(pageSize) || 10;

  const whereCondition = {
    matchId: matchId,
  };

  try {
    const matchParticipants = await MatchParticipant.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      include: {
        model: Alias,
        attributes: ["gamerTag", "userId"], // Include only specified fields
        where: {
          gamerTag: {
            [Op.like]: `%${filter}%`,
          },
        },
      },
    });

    //matchParticipants.rows = matchParticipants.rows.map((participant => {participant.id, participant.aliasId, participant.matchId, participant.alias.gamerTag, participant.alias.userId }));

    const formattedResponse = { rows: [], count: matchParticipants.count };
    formattedResponse.rows = matchParticipants.rows.map((participant) => ({
      id: participant.id,
      aliasId: participant.aliasId,
      matchId: participant.matchId,
      gamerTag: participant.alias.gamerTag,
      userId: participant.alias.userId,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve MatchParticipants" });
  }
};

export default exports;
