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
      model: User, // Correct reference
      key: 'id'
    }
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model:Group, // Correct reference
      key: 'id'
    }
  }
}, {
  timestamps: true // Ensures createdAt and updatedAt fields are available
});

// Associations
User.hasMany(GroupMessages, { foreignKey: 'userId' });
GroupMessages.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(GroupMessages, { foreignKey: 'groupId' });
GroupMessages.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = GroupMessages;
;

