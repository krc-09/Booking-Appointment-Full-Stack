
const User = require('../MODELS/users');
const GroupMessages = require('../MODELS/groupmessages');
const Group = require('../MODELS/groups');

exports.postGroupMessageDetails = async (req, res, next) => {
  const { groupId, userId, messagecontent } = req.body;

  try {
    // Step 1: Validate if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Step 2: Validate if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Create the group message
    const groupMessage = await GroupMessages.create({
      groupId: groupId,
      userId: userId,
      messagecontent: messagecontent,
    });

    // Step 4: Send success response with the created message details
    res.status(201).json({
      message: 'Group message created successfully',
      groupMessage: groupMessage,
    });
  } catch (error) {
    console.error('Error creating group message:', error);
    res.status(500).json({ error: 'Failed to send group message' });
  }
};
exports.getGroupMessageDetails = async (req, res, next) => {
    const { groupId } = req.params; // Get groupId from route params
  
    try {
      // Fetch all messages for a specific group, including user details
      const messages = await GroupMessages.findAll({
        where: { groupId: groupId },
        include: [
          {
            model: User,
            attributes: ['id', 'name'], // Include necessary user fields
          },
          {
            model: Group,
            attributes: ['id', 'groupName'], // Include necessary group fields
          }
        ],
        order: [['createdAt', 'DESC']] // Sort messages by most recent
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching group messages:', error);
      res.status(500).json({ error: 'Failed to fetch group messages' });
    }
  };
  