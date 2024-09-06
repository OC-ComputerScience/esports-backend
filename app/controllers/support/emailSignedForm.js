import FormFieldUtils from "../../sequelizeUtils/formVersionFields.js";
import Helpers from "./signedFormHelpers.js";
import User from "../../models/user.model.js";

import sendMail from "../../utilities/sendMail.js";

const getEmailBody = (playerName) => {
  const body = `Dear ${playerName},

    \tAttached to this email, you will find the signed copy of your player agreement. 
    We're excited to have you on board and look forward to a successful year together. 
    Please take a moment to review the document if you have not already, and don’t hesitate to reach out if you have any questions or need any clarifications. 
    Looking forward to working with you!

  Blessings,
  [image: Oklahoma Christian University]
  Lucas Hayworth, MBA
  Oklahoma Christian University
  Director of Esports | Athletics
  405.305.2692 | Discord <https://discord.gg/dexz9Ev> & Twitter
  <https://twitter.com/Maestraeux> @Maestraeux
  `;

  return body;
};

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
    getEmailBody(user.fName),
    fileAttachment,
  );
};

export default emailSignedForm;
