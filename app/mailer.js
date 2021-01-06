import nodemailer from "nodemailer";
import env from "../env";

const transport = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "no-reply-rabbit@mail.ru",
    pass: env.mail_pass,
  },
});

const mailer = (message, callback) => {
    transport.sendMail(message, (err, info) => {
        callback(err, info)
    })
}

export default mailer;