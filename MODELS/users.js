const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Users = sequelize.define('user',

  {
    id:{

      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    
   phone:{
      type:Sequelize.STRING,
      unique:true
    },
   name:{
      type:Sequelize.STRING,
      allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true, 
    validate: {
      isEmail: true 
    }},
  password:{
    type:Sequelize.STRING,
    allowNull:false
  }

  });
module.exports = Users;