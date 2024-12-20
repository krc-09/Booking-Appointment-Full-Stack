const Group = require('../MODELS/groups');
const User = require('../MODELS/users');


const GroupUser = require('../MODELS/GroupUser');

exports.postGroupDetails = async (req, res, next) => {
    const { groupName, users } = req.body; // `users` is an array of user IDs

    if (!groupName || !Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ error: 'Group name and at least one user are required.' });
    }

    try {
        // Step 1: Create the group
        const group = await Group.create({
            groupName: groupName,
            createdBy: req.user.name, // Assuming req.user is populated with the logged-in user's details
            memberCount: users.length + 1 // Users + Creator
        });

        if (!group) {
            return res.status(500).json({ error: 'Failed to create the group.' });
        }

        // Step 2: Add the creator as admin and users as members to the GroupUser table
        const groupUsersData = [
            { 
                groupId: group.id, 
                userId: req.user.id, 
                createdBy: req.user.name, 
                role: 'admin' 
            }, // Creator is admin
            ...users.map(userId => ({
                groupId: group.id,
                userId: userId,
                createdBy: req.user.name,
                role: 'member'
            }))
        ];

        // Log the group user data to debug role assignments
        console.log('Group Users Data:', groupUsersData);

        await GroupUser.bulkCreate(groupUsersData);

        // Step 3: Send success response
        res.status(201).json({
            message: 'Group and users added successfully!',
            group: group
        });
    } catch (error) {
        console.error('Error creating group or adding users:', error);
        res.status(500).json({ error: 'Failed to create group and add users' });
    }
};


exports.getgroupDetails = async (req, res, next) => {
   try{

    const groups = await Group.findAll({
        attributes: ['id', 'createdBy', 'groupName', 'memberCount'],
        include: [{
            model: GroupUser,
            attributes: ['userId', 'role']
        }]
    });
      
        res.status(200).json(groups);

    } catch (err) {
        console.error('Error fetching groups:', err);
        res.status(500).json({ error: 'An error occurred while fetching groups' });
    }
};
exports.deleteGroup = async (req, res, next) => {
    const { groupId } = req.query; // Assuming group ID is passed as a URL parameter

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required for deletion.' });
    }

    try {
        // Fetch group details before deletion (optional, based on requirements)
        const group = await Group.findByPk(groupId, {
            attributes: ['id', 'createdBy', 'groupName', 'memberCount']
        });

        if (!group) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        // Delete the group
        await Group.destroy({
            where: { id: groupId }
        });

        // Optional: Clean up associated GroupUser entries
        await GroupUser.destroy({
            where: { groupId: groupId }
        });

        res.status(200).json({
            message: 'Group deleted successfully.',
            group: group // Returning the deleted group details (optional)
        });
    } catch (err) {
        console.error('Error deleting group:', err);
        res.status(500).json({ error: 'An error occurred while deleting the group.' });
    }
};
