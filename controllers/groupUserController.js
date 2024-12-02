const GroupUser = require('../MODELS/GroupUser'); 
// Assuming you have a GroupUser model
const Group = require('../MODELS/groups');


exports.addUsersToGroup = async (req, res) => {
    const groupId = req.body.groupId;  // Get the group ID from the request body
    const users = req.body.users;      // Array of user IDs to be added to the group

    if (!groupId || users.length === 0) {
        return res.status(400).json({ error: 'Group ID and users are required' });
    }

    try {
        // Ensure the groupId is valid and exists (You may want to check if the group exists)
        // Assuming you have a Group model to verify this
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Prepare the data for bulk insert into the group_user table
        const groupUsersData = users.map(userId => ({
            groupId: groupId,
            userId: userId,
            createdBy: req.user.name // Assuming `req.user` has the current user's details
        }));

        // Insert the new group users into the `group_user` table
        await GroupUser.bulkCreate(groupUsersData);

        res.status(201).json({ message: 'Users added to the group successfully!' });
    } catch (error) {
        console.error('Error adding users to group:', error);
        res.status(500).json({ error: 'Failed to add users to the group' });
    }
};
exports.getUserGroups = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is available in req.user.id
    
    try {
        // Find all the groups that the user belongs to
        const userGroups = await GroupUser.findAll({
            where: { userId: userId },  // Filter by user ID
            attributes: ['groupId'],     // Select only the groupId
            include: [{
                model: Group,            // Assuming 'Group' is the group model
                attributes: ['id', 'groupName'],  // Select the group id and name
            }],
        });

        // Extract the group details from the result
        const groups = userGroups.map(groupUser => ({
            groupId: groupUser.group.id,
            groupName: groupUser.group.groupName
        }));

        res.status(200).json({ groups });
    } catch (err) {
        console.error('Error fetching user groups:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
};


