const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./users'); // Import user model
const Group = require('./groups'); // Import group model

const GroupMessages = sequelize.define('groupmessage', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  messagecontent: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User, // Correct reference to User model
      key: 'id'
    }
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Group, // Correct reference to Group model
      key: 'id'
    }
  }
}, {
  timestamps: true // Ensures createdAt and updatedAt fields are available
});

// Associations
User.hasMany(GroupMessages, { foreignKey: 'userId', onDelete: 'CASCADE' });
GroupMessages.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(GroupMessages, { foreignKey: 'groupId', onDelete: 'CASCADE' });
GroupMessages.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = GroupMessages;
