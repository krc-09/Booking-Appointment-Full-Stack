const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const GroupUser = sequelize.define('group_user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  groupId: {  // Use groupId instead of groupName
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id'
    }
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  tableName: 'group_users'  // Explicitly set the table name
});

module.exports = GroupUser;
