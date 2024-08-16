import Form from "../models/form.model.js";
import FormVersion from "../models/formVersion.model.js";
import { Sequelize } from "sequelize";

const exports = {};

exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await FormVersion.findOne({
      where: { id },
    });

    if (form) {
      res.status(200).json(form);
    } else {
      res.status(404).json({ message: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findAllForForm = async (req, res) => {
  const { formId } = req.params;
  FormVersion.findAll({
    where: { formId },
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.findAllDirector = async (req, res) => {
  FormVersion.findAll({
    attributes: [
      "id",
      "source",
      "formId",
      "requireDirectorSig",
      [Sequelize.fn("MAX", Sequelize.col("effectiveDate")), "date"],
    ],
    group: ["formId"],
    include: {
      model: Form,
      attributes: ["name"],
    },
  })
    .then((results) => {
      const filteredResults = results.filter(
        (result) => result.requireDirectorSig,
      );
      res.status(200).send(filteredResults);
    })
    .catch((error) => {
      console.error(error);
    });
};

export default exports;
