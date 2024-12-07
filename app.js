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
app.use(cors());
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
const GroupUser = require('./MODELS/GroupUser');
const Group = require('./MODELS/groups');






const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
  const groupRoutes = require('./routes/groups');
 const groupUsers = require('./routes/groupusers');
  const groupMessage = require('./routes/groupMessages');

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
 app.use('/groups',groupRoutes);
 app.use('/groupUsers',groupUsers);
  app.use('/groupMessages',groupMessage);


Users.hasMany(Messages);
Messages.belongsTo(Users);
Users.hasMany(GroupUser, { foreignKey: 'userId' });
GroupUser.belongsTo(Users, { foreignKey: 'userId' });
Group.hasMany(GroupUser, { foreignKey: 'groupId' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId' });



sequelize.sync({alter:true})
  .then(result => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });

