import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    //1) Create Transport
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    //2) Verify transport connection
    await transport.verify();

    //2) Define the email options
    const mailOptions = {
      from: 'Natours Admin <admin@natours.io>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // Add HTML support
      html: options.html || options.message.replace(/\n/g, '<br>'),
    };

    //3) Send the email
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent. Please try again later.');
  }
};

export default sendEmail;
