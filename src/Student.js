/* eslint-disable @typescript-eslint/no-var-requires */
var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Student',
  tableName: 'students',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    fullName: {
      type: 'varchar',
    },
    accessCode: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
    },
    suspended: {
      type: 'boolean',
    },
  },
});
