import nodemailer from "nodemailer";
import { getVerificationEmailTemplate,getResetPasswordEmailTemplate } from "./email__template.js";
import dotenv from "dotenv"

dotenv.config()

const sendVerificationEmail = async function (userEmail,verificationToken) {

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const emailSubject = "Verify your Account: ";

  const emailText = `Thanks for Registering with Auth sys. To verify send request to the URL: ${process.env.BASE_URL}/api/users/verify/${verificationToken}`;

  const verificationEmailTemplate =
    getVerificationEmailTemplate(process.env.BASE_URL,verificationToken);

  const message = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: userEmail,
    subject: emailSubject,
    text: emailText,
    html: verificationEmailTemplate,
  };

  const emailInfo = await transport.sendMail(message);
  return emailInfo;

};

const sendResetPasswordEmail = async function (userEmail,resetPasswordToken) {

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const emailSubject = "Resetting your Password: ";

  const emailText = `A reset To verify  send request to the URL: ${process.env.BASE_URL}/api/users/reset/${resetPasswordToken}`;

  const resetPassEmailTemplate =
    getResetPasswordEmailTemplate(process.env.BASE_URL,resetPasswordToken);

  const message = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: userEmail,
    subject: emailSubject,
    text: emailText,
    html: resetPassEmailTemplate,
  };

  const emailInfo = await transport.sendMail(message);
  return emailInfo;

};


export  {
  sendVerificationEmail,
  sendResetPasswordEmail
};
