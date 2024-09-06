import FormFieldUtils from "../../sequelizeUtils/formVersionFields.js";
import Helpers from "./signedFormHelpers.js";
import User from "../../models/user.model.js";

import sendMail from "../../utilities/sendMail.js";

const getEmailBody = (playerName) => {
  const body = `
  <p>Dear ${playerName},</p>

  <p  style="text-indent: 25px; padding-left: 25px">Attached to this email, you will find the signed copy of your player agreement. We're excited to have you on board and look forward to a successful year together. Please take a moment to review the document if you have not already, and don't hesitate to reach out if you have any questions or need any clarifications. Looking forward to working with you!</p>

  <p>Blessings,</p>

  <div>
    <div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">
      <div dir="ltr">
        <table border="0" cellspacing="0" cellpadding="0" style="border-width:0px;border-color:rgb(249,249,249);border-style:solid;border-collapse:collapse;color:rgb(128,19,40);font-family:sofia-pro,-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,'Noto Sans',sans-serif;font-size:18px;margin-top:50px">
          <tbody style="border-width:0px;border-color:rgb(249,249,249);border-style:solid">
            <tr style="border-width:0px;border-color:rgb(249,249,249);border-style:solid">
              <td width="88px;" valign="middle" style="border-width:0px 2px 0px 0px;border-color:rgb(249,249,249) rgb(128,19,40) rgb(249,249,249) rgb(249,249,249);border-style:solid;border-collapse:collapse;width:88px;vertical-align:middle;padding:9px 16px 9px 0px">
                <img src="https://ddtjogezxr16i.cloudfront.net/images/email/oc-logo-email-75.png" alt="Oklahoma Christian University" width="150" height="150" style="font-family:sofia-pro;font-size:17px;font-weight:600;margin:0px;padding:0px;display:block;width:150px;height:150px">
              </td>
              <td style="border-width:0px;border-color:rgb(249,249,249);border-style:solid;border-collapse:collapse;font-size:12px;line-height:1.4;font-family:arial,sans-serif;padding-left:14px;padding-top:2px">
                <div style="border-width:0px;border-color:rgb(249,249,249);border-style:solid;font-weight:bold">
                  <span style="border-width:0px;border-color:rgb(249,249,249);border-style:solid">Lucas Hayworth, MBA</span>
                </div>
                <div style="border-width:0px;border-color:rgb(249,249,249);border-style:solid">Oklahoma Christian University</div>
                <div style="border-width:0px;border-color:rgb(249,249,249);border-style:solid;white-space:pre-line">
                  <span style="border-width:0px;border-color:rgb(249,249,249);border-style:solid">Director of Esports | Athletics</span>
                </div>
                <span style="border-width:0px;border-color:rgb(249,249,249);border-style:solid">405.305.2692</span> | 
                <a href="https://discord.gg/dexz9Ev" target="_blank">Discord</a> &amp; 
                <a href="https://twitter.com/Maestraeux" target="_blank">Twitter</a> @Maestraeux
              </td>
            </tr>
          </tbody>
        </table>
        <br>
      </div>
    </div>
  </div>

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
