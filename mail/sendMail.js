const nodemailer = require('nodemailer');

const sendMail = (user, subject, content) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_AUTH,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_AUTH,
    to: user,
    subject: subject,
    html: content
  };

  transporter.sendMail(mailOptions, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Verify email sent successfully');
    }
  })
};

module.exports = {
  sendMail: sendMail
};