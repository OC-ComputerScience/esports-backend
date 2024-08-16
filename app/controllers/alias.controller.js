import db from "../models/index.js";

const Alias = db.alias;
const Op = db.Sequelize.Op;

const exports = {};

exports.create = (req, res) => {
  //Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can't be empty",
    });
  } else if (!req.body.gamerTag) {
    res.status(400).send({
      message: "Gamer tag can't be empty",
    });
  }

  //Create alias
  const alias = {
    id: req.body.id,
    userId: req.params.userId,
    aliasType: req.params.aliasType,
    title: req.body.title,
    gamerTag: req.body.gamerTag,
  };

  // Save Alias in the database

  Alias.findAll({ where: { aliasType: "Primary" } })
    .then((data) => {
      if (data.length != 0) {
        alias.aliasType = "Alternate";
      } else {
        alias.aliasType = "Primary";
      }
      Alias.create(alias)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Alias.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something went wrong during validation checks",
      });
    });
};

exports.findAllForUser = (req, res) => {
  const userId = req.params.userId;
  const type = req.query.type;

  var condition = {
    userId: userId,
    [Op.and]: [type ? { aliasType: { [Op.like]: `%${type}%` } } : null],
  };

  Alias.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something went wrong while retrieving aliases",
      });
    });
};

exports.findAllForTeam = (req, res) => {
  const teamId = req.params.teamId;

  Alias.findAll({
    where: {
      teamId: teamId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something went wrong while retrieving aliases",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Alias.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find Alias with id=${id}.",
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Error retrieving Alias with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  const alias = {
    id: id,
    title: req.body.title,
    gamerTag: req.body.gamerTag,
    userId: req.params.userId,
  };

  Alias.update(alias, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Alias was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update Alias with id=${id}. Maybe Alias was not found or req.body is empty!",
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "There was an error while updating Alias with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Alias.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Alias was deleted successfully",
        });
      } else {
        res.send({
          message: "Cannot delete Alias with id=${id}.",
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Could not delete Alias with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Alias.destroy({
    where: {},
    truncate: false,
  })
    .then(() => {
      res.send({ message: "${nums} Aliases were deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while removing all Aliases.",
      });
    });
};

export default exports;
