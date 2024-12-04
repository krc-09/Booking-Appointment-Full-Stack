const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const GroupUser = sequelize.define('group_user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    defaultValue: 'member',
    allowNull: false
  }
}, {
  tableName: 'group_users',
  timestamps: true
});

module.exports = GroupUser;
