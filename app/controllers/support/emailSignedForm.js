import FormFieldUtils from "../../sequelizeUtils/formVersionFields.js";
import Helpers from "./signedFormHelpers.js";
import User from "../../models/user.model.js";

import sendMail from "../../utilities/sendMail.js";

const getEmailBody = (playerName) => {
  const body = `
  <p>Dear ${playerName},</p>
<p>Attached to this email, you will find the signed copy of your player agreement. We&#39;re exc
ited to have you on board and look forward to a successful year together. 
Please take a moment to review the document if you have not already, 
and don't hesitate to reach out if you have any questions or need any clarifications. 
Looking forward to working with you!</p>

<p>Blessings,</p>

<div>
      <div dir=3D"ltr" class=3D"gmail_signature" data-smart=
         mail=3D"gmail_signature">
         <div dir=3D"ltr">
            <table border=3D"0" cellspacing=
            =3D"0" cellpadding=3D"0" style=3D"border-width:0px;border-color:rgb(249,249=
            ,249);border-style:solid;border-collapse:collapse;color:rgb(128,19,40);font=
            -family:sofia-pro,-apple-system,BlinkMacSystemFont,&quot;Helvetica Neue&quo=
            t;,Arial,&quot;Noto Sans&quot;,sans-serif;font-size:18px;margin-top:50px">
            <tbody style=3D"border-width:0px;border-color:rgb(249,249,249);border-style:=
            solid">
            <tr style=3D"border-width:0px;border-color:rgb(249,249,249);border-s=
               tyle:solid">
               <td width=3D"88px;" valign=3D"middle" style=3D"border-width:0px=
               2px 0px 0px;border-color:rgb(249,249,249) rgb(128,19,40) rgb(249,249,249) =
               rgb(249,249,249);border-style:solid;border-collapse:collapse;width:88px;ver=
               tical-align:middle;padding:9px 16px 9px 0px"><img src=3D"https://ddtjogezxr=
               16i.cloudfront.net/images/email/oc-logo-email-75.png" alt=3D"Oklahoma Chris=
               tian University" width=3D"150" height=3D"150" style=3D"font-family:sofia-pr=
               o;font-size:17px;font-weight:600;margin:0px;padding:0px;display:block;width=
               :150px;height:150px"></td><td style=3D"border-width:0px;border-color:rgb(24=
               9,249,249);border-style:solid;border-collapse:collapse;font-size:12px;line-=
               height:1.4;font-family:arial,sans-serif;padding-left:14px;padding-top:2px">
               <div style=3D"border-width:0px;border-color:rgb(249,249,249);border-style:s=
                  olid;font-weight:bold"><span style=3D"border-width:0px;border-color:rgb(249=
                  ,249,249);border-style:solid">Lucas Hayworth, MBA</span>
               </div>
               <div style=3D=
               "border-width:0px;border-color:rgb(249,249,249);border-style:solid">Oklahoma Christian University
         </div>
         <div style=3D"border-width:0px;border-color:rgb=
         (249,249,249);border-style:solid;white-space:pre-line"><span style=3D"borde=
         r-width:0px;border-color:rgb(249,249,249);border-style:solid">Director of Esports | Athletics</span>
      </div>
      <span style=3D"border-width:0px;border-color=
      :rgb(249,249,249);border-style:solid">405.305.2692</span> | <a href=3D=
      "https://discord.gg/dexz9Ev" target=3D"_blank">Discord</a> &amp; <a hr=
         ef=3D"https://twitter.com/Maestraeux" target=3D"_blank">Twitter</a> @Maestraeux</td></tr></tbody></table><br>
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
