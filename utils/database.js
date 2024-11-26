const Sequelize = require('sequelize');
const sequelize = new Sequelize('booking-application','root','password',{

    dialect : 'mysql',
    host:'localhost'

});
module.exports = sequelize;