import db from "../models/index.js";
import metricUtils from "../sequelizeUtils/metric.js";

const Op = db.Sequelize.Op;

const Metric = db.metric;

const exports = {};

// Create a new Metric
// Create a new Metric
exports.create = (req, res) => {
  const { metricType, dataType, name, titleId } = req.body;

  // Check if any of the required parameters are missing or empty
  if (!metricType || !dataType || !name || !titleId) {
    return res.status(400).json({
      message:
        "All parameters (metricType, dataType, name, titleId) are required and cannot be empty!",
    });
  }

  Metric.create({ metricType, dataType, name, titleId })
    .then((metric) => {
      res.status(201).json(metric);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to create Metric" });
    });
};

// Get all Metrics
exports.getAll = (req, res) => {
  Metric.findAll()
    .then((metrics) => {
      res.status(200).json(metrics);
    })
    .catch(() => {
      res.status(500).json({ error: "Unable to fetch Metrics" });
    });
};

// Get a single Metric by ID
exports.getById = (req, res) => {
  const { id } = req.params;

  Metric.findByPk(id)
    .then((metric) => {
      if (!metric) {
        return res.status(404).json({ error: "Metric not found" });
      }
      res.status(200).json(metric);
    })
    .catch(() => {
      res.status(500).json({ error: "Unable to fetch Metric" });
    });
};

// Update a Metric by ID
exports.update = (req, res) => {
  const { id } = req.params;

  Metric.findByPk(id)
    .then((metric) => {
      if (!metric) {
        return res.status(404).json({ error: "Metric not found" });
      }

      const { metricType, dataType, name, titleId } = req.body;

      metric
        .update({ metricType, dataType, name, titleId })
        .then((updatedMetric) => {
          res.status(200).json(updatedMetric);
        })
        .catch(() => {
          res.status(500).json({ error: "Unable to update Metric" });
        });
    })
    .catch(() => {
      res.status(500).json({ error: "Unable to update Metric" });
    });
};

// Delete a Metric by ID
exports.delete = (req, res) => {
  const { id } = req.params;

  Metric.findByPk(id)
    .then((metric) => {
      if (!metric) {
        return res.status(404).json({ error: "Metric not found" });
      }

      metric
        .destroy()
        .then(() => {
          res.status(200).send({ msg: "Metric Deleted Successfully" });
        })
        .catch(() => {
          res.status(500).json({ error: "Unable to delete Metric" });
        });
    })
    .catch(() => {
      res.status(500).json({ error: "Unable to delete Metric" });
    });
};

exports.getAllForTitle = async (req, res) => {
  console.log(req.params, req.query);
  const titleId = req.params.titleId;

  const id = req.query.id;
  const name = req.query.name;
  const filter = req.query.filter;
  const offset = req.query.pageSize * (req.query.page - 1) || 0;
  const limit = Number(req.query.pageSize) || 10; // Adjust the default limit as needed
  var condition = {
    titleId: titleId,
    [Op.or]: [
      {
        id: {
          [Op.like]: `%${
            filter == undefined || filter == "" || filter == null
              ? id
                ? id
                : ""
              : filter
          }%`,
        },
      },
      {
        name: {
          [Op.like]: `%${
            filter == undefined || filter == "" || filter == null
              ? name
                ? name
                : ""
              : filter
          }%`,
        },
      },
    ],
  };

  await metricUtils
    .findAllMatchesWhere(condition, offset, limit)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving matches.",
      });
    });
};

exports.findAllMatchMetricsForTitle = async (req, res) => {
  await metricUtils
    .getAllMetricsByType(req.params.titleId, "Match")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving metrics",
      });
    });
};

exports.findAllPlayerMetricsForTitle = async (req, res) => {
  await metricUtils
    .getAllMetricsByType(req.params.titleId, "Player")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving metrics",
      });
    });
};

exports.getDataTypes = (req, res) => {
  res.send(Metric.getAttributes().dataType.values);
};

exports.getMetricTypes = (req, res) => {
  console.log(Metric.getAttributes().metricType.values);
  res.send(Metric.getAttributes().metricType.values);
};

export default exports;
