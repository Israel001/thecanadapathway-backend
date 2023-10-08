/* eslint-disable @typescript-eslint/no-var-requires */
var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'NotificationTemplate',
  tableName: 'notification_templates',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    code: {
      type: 'varchar',
    },
    body: {
      type: 'varchar',
    },
  },
});
