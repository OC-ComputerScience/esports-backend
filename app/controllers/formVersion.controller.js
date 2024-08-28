import Form from "../models/form.model.js";
import FormVersion from "../models/formVersion.model.js";
import { Sequelize } from "sequelize";

import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.create = (req, res) => {
  const { formId } = req.params;
  const {
    source,
    effectiveDate,
    expireDate,
    requireDirectorSig,
    versionNumber,
  } = req.body;

  // Check if any of the required parameters are missing or empty
  if (!formId) {
    return res.status(400).json({
      message: "Form Id is required",
    });
  }

  FormVersion.create({
    source,
    effectiveDate,
    expireDate,
    formId,
    requireDirectorSig,
    versionNumber,
  })
    .then((formVersion) => {
      res.status(201).json(formVersion);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unable to create FormVersion" });
    });
};

exports.update = async (req, res) => {
  await FormVersion.update(req.body, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Form Version was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update form version with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating form version with id = " + req.params.id,
      });
      console.log("Could not update form version: " + err);
    });
};

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

exports.uploadFile = async (req, res) => {
  const { versionId } = req.params;

  const formVersion = await FormVersion.findByPk(versionId);

  if (formVersion) {
    try {
      await FileHelpers.upload(req, res); // attempt to save new file

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }

      if (formVersion.source && formVersion.source !== req.file.filename) {
        // remove old if there is one and hasn't already been replaced
        console.log("Remove Old File", formVersion.source);
        FileHelpers.remove(formVersion.source);
      }

      let updatedFormVersion = formVersion.dataValues;
      updatedFormVersion.source = req.file.filename;

      console.log(updatedFormVersion);
      await FormVersion.update(updatedFormVersion, {
        where: {
          id: versionId,
        },
      }).catch((error) => {
        console.log(error);
      });

      res.status(200).send({
        message: "File Uploaded Sucessfully",
      });
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file}. ${err}`,
      });
    }
  } else {
    res.status(404).send({
      message: `Could not find Form Version with id=${versionId}`,
    });
  }
};

export default exports;
