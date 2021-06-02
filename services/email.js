const sendgrid = require('@sendgrid/mail');
const Mailgen = require('mailgen');
require('dotenv').config;

class EmailService {
  #sender = sendgrid;
  #generateTemplate = Mailgen;
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
      case 'production':
        this.link = 'link for production';
        break;

      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }
  #createTemplateVerifyEmail(verifyTokenEmail) {
    const mailGenerator = new this.#generateTemplate({
      theme: 'neopolitan',
      product: {
        name: 'Contacts system',
        link: this.link,
      },
    });

    const email = {
      body: {
        name: 'User',
        intro: "Welcome to Contacts system! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Contacts system, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyTokenEmail}`,
          },
        },
      },
    };
    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }

  async sendVerificationEmail(verifyTokenEmail, email) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'ternovskaya.svetlana89@gmail.com',
      subject: 'Verify email',
      html: this.#createTemplateVerifyEmail(verifyTokenEmail),
    };
    this.#sender.send(msg);
  }
}

module.exports = EmailService;
