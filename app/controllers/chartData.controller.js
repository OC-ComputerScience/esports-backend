import ChartData from "../sequelizeUtils/chartData.js";
const exports = {};

// Find all Matches
exports.findAllDataForPlayer = async (req, res) => {
  const aliasId = req.params.aliasId;
  const metricId = req.params.metricId;

  await ChartData.findAllDataForPlayer(aliasId, metricId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving matches.",
      });
    });
};

export default exports;
