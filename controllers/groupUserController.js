const GroupUser = require('../MODELS/GroupUser'); // Assuming you have a GroupUser model

exports.addUsersToGroup = async (req, res) => {
    const groupName = req.body.groupName;
    const users = req.body.users; // Array of user IDs

    if (!groupName || users.length === 0) {
        return res.status(400).json({ error: 'Group name and users are required' });
    }

    try {
        // Create multiple entries in the groupUser table in one operation
        const groupUsersData = [
            { groupId: group.id, userId: req.user.id, createdBy: req.user.name }, // Creator
            ...users.map(userId => ({
                groupId: group.id,
                userId: userId,
                createdBy: req.user.name
            }))
        ];

        await GroupUser.bulkCreate(groupUsersData);

        res.status(201).json({ message: 'Group created successfully!', group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
};