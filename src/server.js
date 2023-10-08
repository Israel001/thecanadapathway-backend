/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const cors = require('cors');
const typeorm = require('typeorm');
const mailer = require('nodemailer-promise');
const axios = require('axios');
const util = require('util');
const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;
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

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
  res.send('Welcome to Backend API!!!');
});

app.post('/verify-transaction/:transactionId', async (req, res) => {
  const response = await axios
    .get(
      `${process.env.FLUTTERWAVE_BASE_URL}/transactions/${req.params.transactionId}/verify`,
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
  const data = response.data.data;
  if (
    data.status !== 'successful' ||
    data.amount !== req.body.amount ||
    data.customer.email !== req.body.email
  ) {
    return res
      .status(406)
      .send({ status: 406, message: 'Transaction is not valid' });
  }
  const accessCode = data.tx_ref.toUpperCase();
  if (!dataSource.isInitialized) await dataSource.initialize();
  const paymentRepository = dataSource.getRepository('Payment');
  const studentRepository = dataSource.getRepository('Student');

  const paymentExists = await paymentRepository.findOne({
    where: { reference: accessCode },
  });
  if (paymentExists)
    return res.status(409).send({ status: 409, message: 'Duplicate payment' });
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

  return res.status(201).send({
    status: 201,
    message: 'Transaction verified successfully',
  });
});

app.listen(port, () => {
  console.log(`API is started on PORT 8080...`);
});

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
    return res.status(404).send({
      status: 404,
      message: `Notification template: ${email.templateCode} does not exist`,
    });
  }
  email.html = email.data
    ? replacer(0, Object.entries(email.data), notificationTemplate.body)
    : notificationTemplate.body;
  delete email.templateCode;
  if (!email.bcc) email.bcc = 'info@thecanadapathway.com';
  if (!email.from) email.from = 'WasteNG <info@thecanadapathway.com>';
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
