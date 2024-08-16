import db from "../models/index.js";

const FormVersionField = db.formVersionField;

const exports = {};

exports.findAllForFormVersion = async (formVersionId) => {
  //const processedData = [];
  const formFields = await FormVersionField.findAll({
    where: {
      formVersionId: formVersionId,
    },
  });

  const formattedFields = formFields.map((field) => {
    return {
      id: field.id,
      fieldName: field.fieldName,
      dataAttribute: field.dataAttribute,
    };
  });
  return formattedFields;
};

export default exports;
