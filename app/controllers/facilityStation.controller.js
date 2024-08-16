import db from "../models/index.js";

const FacilityStation = db.facilityStation;

const facilityStationController = {};

// Create a new FacilityStation
facilityStationController.create = (req, res) => {
  const { name, numSeats } = req.body;

  // Check if any of the required parameters are missing or empty
  if (!name || numSeats === undefined) {
    return res.status(400).json({
      message:
        "All parameters (name, numSeats) are required and cannot be empty!",
    });
  }

  FacilityStation.create({ name, numSeats })
    .then((facilityStation) => {
      res.status(201).json(facilityStation);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unable to create FacilityStation" });
    });
};

// Get all FacilityStations
facilityStationController.getAll = (req, res) => {
  FacilityStation.findAll()
    .then((facilityStations) => {
      res.send(facilityStations);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch FacilityStations" });
    });
};

// Get FacilityStation by ID
facilityStationController.getById = (req, res) => {
  const { id } = req.params;
  FacilityStation.findByPk(id)
    .then((facilityStation) => {
      if (!facilityStation) {
        return res.status(404).json({ error: "FacilityStation not found" });
      }
      res.status(200).json(facilityStation);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch FacilityStation" });
    });
};

// Update FacilityStation by ID
facilityStationController.update = (req, res) => {
  const { id } = req.params;

  FacilityStation.findByPk(id).then((facilityStation) => {
    if (!facilityStation) {
      return res.status(404).json({ error: "FacilityStation not found" });
    }

    const { name, numSeats } = req.body;

    facilityStation.name = name;
    facilityStation.numSeats = numSeats;

    facilityStation
      .save()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Unable to update FacilityStation",
        });
      });
  });
};

// Delete FacilityStation by ID
facilityStationController.delete = (req, res) => {
  const { id } = req.params;
  FacilityStation.findByPk(id)
    .then((facilityStation) => {
      if (!facilityStation) {
        return res.status(404).json({ error: "FacilityStation not found" });
      } else {
        facilityStation.destroy();
        return res
          .status(200)
          .json({ message: "FacilityStation deleted successfully" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: err.message || "Unable to delete FacilityStation" });
    });
};

export default facilityStationController;
