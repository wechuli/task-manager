const sgMail = require("@sendgrid/mail");

const sendGridAPIKEY = process.env.SEND_GRID_API_KEY;

sgMail.setApiKey(sendGridAPIKEY);

const sendWelcomeEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: "wechulipaul@outlook.com",
    subject: "Thanks for joining the service",
    text: `Welcome to the app ${name}. Let me know how you get along with the app`
  });
};

const sendCancellationEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: "wechulipaul@outlook.com",
    subject: "Sorry to see You Go",
    text: `Sorry to see you go ${name}. Please tell us if we could have done anything to make you stay`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
