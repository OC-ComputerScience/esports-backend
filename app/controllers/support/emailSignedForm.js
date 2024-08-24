import FormFieldUtils from "../../sequelizeUtils/formVersionFields.js";
import Helpers from "./signedFormHelpers.js";
import User from "../../models/user.model.js";

import sendMail from "../../utilities/sendMail.js";

const emailSignedForm = async (userSignature) => {
  const { userId, formVersionId, directorUserId } = userSignature;

  const user = await User.findByPk(userId);
  const director = await User.findByPk(directorUserId);

  const fields = await FormFieldUtils.findAllForFormVersion(formVersionId);

  const pdfBytes = await Helpers.getSignedPDF(
    fields,
    user,
    director,
    userSignature,
    formVersionId,
  );

  if (!user || !director || !userSignature || !fields || !pdfBytes) {
    throw "Error Generating Signed Form";
  }

  const fileName = user.fName + "_" + user.lName + "_Player_Agreement_2024.pdf";

  const fileAttachment = {
    filename: fileName,
    path: "data:application/pdf;base64," + pdfBytes,
  };

  sendMail(
    director.email,
    user.email,
    "",
    "Signed Player Agreement",
    "Hello,\n\n Here is your signed player agreement",
    fileAttachment,
  );
};

export default emailSignedForm;
