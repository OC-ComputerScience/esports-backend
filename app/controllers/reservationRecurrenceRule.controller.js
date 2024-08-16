import RecurrenceRule from "../models/reservationRecurrenceRule.model.js"; // Adjust the path as necessary

const exports = {};

exports.create = async (req, res) => {
  await RecurrenceRule.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the recurrence rule.",
      });
    });
};

exports.findOne = async (req, res) => {
  console.log("find one\n\n");
  await RecurrenceRule.findByPk(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find recurrence rule with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving recurrence rule with id = " + req.params.id,
      });
      console.log("Could not find recurrence rule: " + err);
    });
};

exports.findAll = async (req, res) => {
  console.log("find all\n\n");
  await RecurrenceRule.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving recurrence rules.",
      });
    });
};

exports.update = async (req, res) => {
  await RecurrenceRule.update(req.body, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Recurrence rule was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update recurrence rule with id = ${req.params.id}. Maybe recurrence rule was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating recurrence rule with id = " + req.params.id,
      });
      console.log("Could not update recurrence rule: " + err);
    });
};

exports.delete = async (req, res) => {
  await RecurrenceRule.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Recurrence rule was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete recurrence rule with id = ${req.params.id}. Maybe recurrence rule was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete recurrence rule with id = " + req.params.id,
      });
      console.log("Could not delete recurrence rule: " + err);
    });
};

exports.findByReservationId = async (req, res) => {
  await RecurrenceRule.findOne({
    where: { facilityReservationId: req.params.reservationId },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find recurrence rules with reservationId = ${req.params.reservationId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error retrieving recurrence rules with reservationId = " +
          req.params.reservationId,
      });
      console.log("Could not find recurrence rules: " + err);
    });
};

export default exports;
