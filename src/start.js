/* eslint-disable @typescript-eslint/no-var-requires */
const typeorm = require('typeorm');
const mailer = require('nodemailer-promise');
const axios = require('axios');
const util = require('util');
const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;
const http = require('http');
require('dotenv').config();

const dataSource = new typeorm.DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    require('./Payment'),
    require('./Student'),
    require('./NotificationTemplate'),
  ],
  namingStrategy: new SnakeNamingStrategy(),
});

const port = 8080;

http
  .createServer(async (req, res) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000,
      'Content-Type': 'application/json',
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    if (req.url === '/server/' && req.method === 'GET') {
      res.writeHead(200, headers);
      res.end('Welcome to Backend API!!!');
      return;
    }

    if (
      req.url.includes('/server/verify-transaction') &&
      req.method === 'POST'
    ) {
      const splittedUrl = req.url.split('/');
      const transactionId = splittedUrl[splittedUrl.length - 1];
      const response = await axios
        .get(
          `${process.env.FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
          {
            headers: {
              Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            },
          },
        )
        .catch((error) => {
          console.log(util.inspect(error.response, true, null, false));
          throw error;
        });
      console.log(req.body);
      const data = response.data.data;
      if (
        data.status !== 'successful' ||
        data.amount !== req.body.amount ||
        data.customer.email !== req.body.email
      ) {
        return res
          .statusCode(406)
          .end({ status: 406, message: 'Transaction is not valid' });
      }
      const accessCode = data.tx_ref.toUpperCase();
      if (!dataSource.isInitialized) await dataSource.initialize();
      const paymentRepository = dataSource.getRepository('Payment');
      const studentRepository = dataSource.getRepository('Student');

      const paymentExists = await paymentRepository.findOne({
        where: { reference: accessCode },
      });
      if (paymentExists)
        return res
          .statusCode(409)
          .end({ status: 409, message: 'Duplicate payment' });
      const paymentModel = paymentRepository.create({
        transactionId: data.id,
        reference: accessCode,
        email: data.customer.email,
        metadata: JSON.stringify(data),
      });
      await paymentRepository.save(paymentModel);

      const studentModel = studentRepository.create({
        fullName: data.customer.name,
        email: data.customer.email,
        accessCode,
        suspended: false,
      });
      const studentExists = await studentRepository.findOne({
        where: { email: data.customer.email },
      });
      if (studentExists) studentModel.id = studentExists.id;
      await studentRepository.save(studentModel);

      await sendEmail(
        {
          templateCode: 'order_received',
          to: studentModel.email,
          subject: 'Welcome to the Academy',
          data: {
            fullName: studentModel.fullName,
            email: studentModel.email,
            accessCode: studentModel.accessCode,
          },
        },
        res,
      );

      return res.statusCode(201).end({
        status: 201,
        message: 'Transaction verified successfully',
      });
    }

    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
  })
  .listen(port);

const sendEmail = async (email, res) => {
  const sendMail = mailer.config({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    from: 'DY Travels <info@thecanadapathway.com>',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  if (!dataSource.isInitialized) await dataSource.initialize();
  const notificationTemplateRepository = dataSource.getRepository(
    'NotificationTemplate',
  );

  const notificationTemplate = await notificationTemplateRepository.findOne({
    where: {
      code: email.templateCode,
    },
  });
  if (!notificationTemplate) {
    return res.statusCode(404).end({
      status: 404,
      message: `Notification template: ${email.templateCode} does not exist`,
    });
  }
  email.html = email.data
    ? replacer(0, Object.entries(email.data), notificationTemplate.body)
    : notificationTemplate.body;
  delete email.templateCode;
  if (!email.bcc) email.bcc = 'info@thecanadapathway.com';
  if (!email.from) email.from = 'DY Travels <info@thecanadapathway.com>';
  sendMail(email);
};

const replacer = (i, arr, str) => {
  const len = arr.length;
  if (i < len) {
    const [key, value] = arr[i];
    const formattedKey = `{{${key}}}`;
    return replacer(i + 1, arr, str.split(formattedKey).join(value));
  } else {
    return str;
  }
};
