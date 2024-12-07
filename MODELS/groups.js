const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const GroupUser = require('./GroupUser'); // Import the association model
const User = require('./users');

const Group = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true // Each group must have a unique name
  },
  createdBy: {  // Storing the name of the user who created the group
    type:Sequelize.STRING,
    allowNull: false,
  },
  memberCount: {  // New field to store the number of members
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1 // Default value includes the creator
  }
 
  
}, {
  timestamps: true,
});







module.exports = Group;
