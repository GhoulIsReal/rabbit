require('dotenv').config();

module.exports = {
  database_url: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  port: process.env.PORT || 5000,
  rabbit_url: process.env.RABBIT_URL,
  mail_pass: process.env.MAIL_PASSWORD,
};
