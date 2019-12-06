const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URI,
  jwtSecret: process.env.JWT_SECRET,
  emailAcct: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  twilio: {
    accountSID: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    number: process.env.TWILIO_NUMBER
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET
  }
};
