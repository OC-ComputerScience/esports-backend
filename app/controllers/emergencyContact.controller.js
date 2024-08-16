import db from "../models/index.js";

const EmergencyContact = db.emergencyContact;

const exports = {};

exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "First name can not be empty",
    });
  } else if (!req.body.lName) {
    res.status(400).send({
      message: "Last name can not be empty",
    });
  } else if (!req.body.phoneNumber) {
    res.status(400).send({
      message: "Phone number can not be empty",
    });
  } else if (!req.body.relationship) {
    res.status(400).send({
      message: "Relationship can not be empty",
    });
  }
  // Create Emergency Contact
  const emergencyContact = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    relationship: req.body.relationship,
    userId: req.params.userId,
  };
  // Save Emergency Contact in the database
  EmergencyContact.create(emergencyContact)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while create Emergency Contact.",
      });
    });
};

exports.findAll = (req, res) => {
  EmergencyContact.findAll({ where: { userId: req.params.userId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "An error has occurred while retrieving emergency contacts.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  const userId = req.params.id;

  EmergencyContact.findOne({
    where: { id: id, userId: userId },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find Alias with id=${id}.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Something went wrong while retrieving Emergency Contact.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const userId = req.params.id;
  console.log(id, userId);
  console.log(req.body);

  EmergencyContact.update(req.body, {
    where: { id: id, userId: userId },
  })
    .then((num) => {
      console.log(num);
      if (num == 1) {
        res.send({
          message: "Emergency Contact was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Emergency Contact with id=${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "An error occurred while trying to update Emergency Contact",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  const userId = req.params.id;

  EmergencyContact.destroy({
    where: { id: id, userId: userId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Emergency Contact was deleted successfully.",
        });
      } else {
        res.send({
          message: "There was a problem deleting Emergency Contact.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "There was an error deleteing Emergency Contact.",
      });
    });
};

exports.deleteAll = (req, res) => {
  const userId = req.params.id;

  EmergencyContact.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Emergency Contacts were deleted successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "There was an error while removing all emergency contacts for the provided user.",
      });
    });
};

export default exports;
