/* eslint-disable @typescript-eslint/no-var-requires */
var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Payment',
  tableName: 'payments',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    transactionId: {
      type: 'int',
    },
    reference: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
    },
    metadata: {
      type: 'longtext',
    },
  },
});
