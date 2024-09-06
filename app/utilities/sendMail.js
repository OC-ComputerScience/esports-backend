import nodemailer from "nodemailer";
/*
const email_user = process.env.EMAIL_USER;
const email_pw = process.env.EMAIL_PW;
const email_host = process.env.EMAIL_HOST;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "teamfoursoftware@gmail.com",
    pass: "arqn rgcs ckbn bmsg",
  },
});
*/

const transporter = nodemailer.createTransport({
  host: "SMTP.oc.edu",
  port: 25,
  secure: false,
  debug: true, // show debug output
  logger: true, // log information in console
});

const sendMail = (from, to, cc, subject, body, attachments) => {
  const mailOptions = {
    from: from,
    to: to,
    cc: cc,
    subject: subject,
    html: body,
  };

  if (attachments) {
    mailOptions.attachments = attachments;
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendMail;
