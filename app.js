const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server); // Attach Socket.IO to the server

// Middleware
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Models
const Users = require('./MODELS/users'); 
const Messages = require('./MODELS/messages'); 
const GroupUser = require('./MODELS/GroupUser');
const Group = require('./MODELS/groups');

// Routes
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/groups');
const groupUsers = require('./routes/groupusers');
const groupMessage = require('./routes/groupMessages');

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/groups', groupRoutes);
app.use('/groupUsers', groupUsers);
app.use('/groupMessages', groupMessage);

// Serve static HTML files
app.use((req, res) => {
    console.log(req.url);
    let url = req.url.split('?')[0]; // Remove query parameters
    if (url === '/') {
        res.sendFile(path.join(__dirname, 'public/views/home.html'));
    } else {
        res.sendFile(path.join(__dirname, `public/views${url}`), (err) => {
            if (err) {
                console.log(err);
                res.status(404).send('Page not found');
            }
        });
    }
});

// Socket.IO logic
const users = {};
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
        console.log('A user disconnected');
    });
});

// Database relationships
Users.hasMany(Messages);
Messages.belongsTo(Users);
Users.hasMany(GroupUser, { foreignKey: 'userId' });
GroupUser.belongsTo(Users, { foreignKey: 'userId' });
Group.hasMany(GroupUser, { foreignKey: 'groupId' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId' });

const sequelize = require('./utils/database');

// Sync database and start server
sequelize.sync()
    .then(() => {
        console.log('Database synced');
        server.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.log(err);
    });