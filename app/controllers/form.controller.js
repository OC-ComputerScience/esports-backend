import Form from "../models/form.model.js"; // Adjust the path accordingly
import FormVersion from "../models/formVersion.model.js";

const exports = {};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const newForm = await Form.create({ name });
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Form.findOne({
      where: { id },
      include: [
        {
          model: FormVersion,
          order: [["effectiveDate", "DESC"]],
          limit: 1,
        },
      ],
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

exports.findAll = async (req, res) => {
  try {
    const forms = await Form.findAll({
      include: [
        {
          model: FormVersion,
          order: [["effectiveDate", "DESC"]],
          limit: 1,
        },
      ],
    });

    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRowsCount] = await Form.update(req.body, {
      where: { id },
    });
    if (updatedRowsCount > 0) {
      res.status(200).json({ message: "Form updated successfully" });
    } else {
      res.status(404).json({ message: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRowCount = await Form.destroy({
      where: { id },
    });
    if (deletedRowCount > 0) {
      res.status(200).json({ message: "Form deleted successfully" });
    } else {
      res.status(404).json({ message: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default exports;
