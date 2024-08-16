import FormFieldUtils from "../sequelizeUtils/formVersionFields.js";

import User from "../models/user.model.js";

import Helpers from "./support/signedFormHelpers.js";

import FormVersion from "../models/formVersion.model.js";

const exports = {};

// Find all Matches
exports.modifyAndReturn = async (req, res) => {
  const { userId, formVersionId } = req.params;
  try {
    const user = await User.findByPk(userId);

    const formVersion = await FormVersion.findByPk(formVersionId);

    const userSignature = await Helpers.getUserSignature(userId, formVersionId);

    if (formVersion.requireDirectorSig) {
      if (userSignature.directorDateSigned == null) {
        res.status(400).send({ message: "Awaiting Director Signature" });
      } else {
        // include director signature
        const director = await User.findByPk(userSignature.directorUserId);
        console.log(director, userSignature);
        const fields =
          await FormFieldUtils.findAllForFormVersion(formVersionId);

        const pdfBytes = await Helpers.getSignedPDF(
          fields,
          user,
          director,
          userSignature,
          formVersionId,
        );
        res.status(200).send(pdfBytes);
      }
    } else {
      // no director signature
      const fields = await FormFieldUtils.findAllForFormVersion(formVersionId);

      const pdfBytes = await Helpers.getSignedPDF(
        fields,
        user,
        null,
        userSignature,
        formVersionId,
      );
      res.status(200).send(pdfBytes);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: `Error Retreiving Form with id=${formVersionId}` });
  }
};

export default exports;
