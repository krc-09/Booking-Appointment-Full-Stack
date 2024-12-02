const sequelize = require('./utils/database');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();
//change cors thing
app.use(cors(
    {
        origin:"*",
        credentials:true
    }
));
app.use(bodyParser.json()); 


app.use(express.static(path.join(__dirname, 'views'))); 
const Users = require('./MODELS/users'); 
const Messages = require('./MODELS/messages'); 
const Groups = require('./MODELS/groups');






const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/groups')
const groupUsers = require('./routes/groupusers')

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/groups',groupRoutes);
app.use('/groupUsers',groupUsers);


Users.hasMany(Messages);
Messages.belongsTo(Users);



sequelize.sync()
  .then(result => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });

