const Messages = require('../MODELS/messages');
const Users = require('../MODELS/users');
const sequelize = require('../utils/database');

const { Op } = require('sequelize');
exports.postMessageDetails = async (req, res, next) => {
    const { messagecontent } = req.body; // Extract messagecontent from request body

    // Ensure that req.user is populated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id; // Get user ID from req.user

    try {
        // Find the user by their primary key (user ID) using findByPk
        const user = await Users.findByPk(userId);

        if (!user) {
            // If the user is not found, return an error
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the message with the correct field name 'messagecontent'
        const message = await Messages.create({
            messagecontent: messagecontent,  // Save messagecontent in the database
            userId: userId,  // Use the userId to associate with the message
            username: user.name // Fetch username from the user model
        });

        res.status(201).json({ messagecontent: message.messagecontent, username: message.username });  // Respond with the saved message content
    } catch (err) {
        console.error('Error while saving message:', err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};



exports.getmessages = async (req, res, next) => {
    const after = req.query.after || null;

    try {
        let queryOptions = {
            order: [['createdAt', 'ASC']],
            attributes: ['messagecontent', 'username', 'createdAt']
        };

        if (after) {
            queryOptions.where = {
                createdAt: { [Op.gt]: new Date(after) } // Corrected usage of Op.gt
            };
        }

        const messages = await Messages.findAll(queryOptions);

        res.status(200).json({ messages });

    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
};
