const Messages = require('../MODELS/messages');
const sequelize = require('../utils/database');

exports.postMessageDetails = async (req, res, next) => {
    const { messagecontent } = req.body; // Extract messagecontent from request body

    try {
        // Save the message with the correct field name 'messagecontent'
        const message = await Messages.create({
            messagecontent: messagecontent,  // Save messagecontent in the database
            userId: req.user.id              // Ensure req.user is set correctly
        });

        res.status(201).json({ messagecontent: message.messagecontent });  // Respond with the saved message content
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
