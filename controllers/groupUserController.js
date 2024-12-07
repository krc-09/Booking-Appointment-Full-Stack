const GroupUser = require('../MODELS/GroupUser'); 
// Assuming you have a GroupUser model
const Group = require('../MODELS/groups');
const User = require('../MODELS/users');


exports.addUserToGroup = async (req, res) => {
    const { userId, groupId, createdBy, role } = req.body;
  
    // Start a transaction
    const transaction = await GroupUser.sequelize.transaction();
  
    try {
      // Check if required fields are provided
      if (!userId || !groupId || !createdBy) {
        return res.status(400).json({ error: 'Missing required fields: userId, groupId, createdBy' });
      }
  
      // Check if the user already exists in the group
      const existingUserInGroup = await GroupUser.findOne({
        where: {
          userId: userId,
          groupId: groupId
        }
      });
  
      if (existingUserInGroup) {
        return res.status(409).json({ message: 'User is already a member of this group' });
      }
  
      // Add the user to the group
      const newGroupUser = await GroupUser.create({
        userId,
        groupId,
        createdBy,
        role: role || 'member'
      }, { transaction });
  
      // Increment memberCount in the groups table
      await Group.increment('memberCount', {
        by: 1,
        where: { id: groupId },
        transaction
      });
  
      // Commit the transaction
      await transaction.commit();
  
      res.status(201).json({
        message: 'User added to group and member count updated successfully',
        groupUser: newGroupUser
      });
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      console.error('Error adding user to group:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.removeUserToGroup = async (req, res) => {
    const { userId, groupId } = req.body;  // Only userId and groupId are needed for deletion

    // Start a transaction
    const transaction = await GroupUser.sequelize.transaction();

    try {
        // Check if required fields are provided
        if (!userId || !groupId) {
            return res.status(400).json({ error: 'User ID and Group ID are required.' });
        }

        // Delete the user from the group
        const deletedUser = await GroupUser.destroy({
            where: {
                userId,      // Specify the userId
                groupId      // Specify the groupId
            },
            transaction
        });

        // If no rows were affected, the user might not exist in the group
        if (deletedUser === 0) {
            return res.status(404).json({ error: 'User not found in this group.' });
        }

        // Decrement the member count in the Group table
        await Group.decrement('memberCount', {
            by: 1,
            where: { id: groupId },
            transaction
        });

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({
            message: 'User deleted and member count updated successfully'
        });
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error deleting user from group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserGroups = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is available in req.user.id
    
    try {
        // Find all the groups that the user belongs to
        const userGroups = await GroupUser.findAll({
            where: { userId: userId },  // Filter by user ID
            attributes: ['groupId','role'],     // Select only the groupId
            include: [
                {
                    model: Group,            // Assuming 'Group' is the group model
                    attributes: ['id', 'groupName', 'createdBy'],  // Select the group id and name
                },
                
            ],
        });
        console.log(userGroups);
        // Extract the group details from the result
        const groups = userGroups.map(groupUser => ({
            groupId: groupUser.group.id,
            groupName: groupUser.group.groupName,
            createdBy: groupUser.group.createdBy,
            currentUserRole: groupUser.role // Access the role from GroupUser
        }));

        res.status(200).json({ groups });
    } catch (err) {
        console.error('Error fetching user groups:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.getGroupUsers = async (req, res) => {
    const { groupId } = req.query; // Assuming groupId is passed as a query parameter

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }

    try {
        // Step 1: Fetch all entries in GroupUser for the given groupId
        const groupUsers = await GroupUser.findAll({
            where: { groupId },
            attributes: ['userId', 'groupId', 'createdBy', 'role'], // Select only necessary columns
        });

        if (!groupUsers || groupUsers.length === 0) {
            return res.status(404).json({ error: 'No users found for this group.' });
        }

        // Extract unique userIds
        const userIds = groupUsers.map(groupUser => groupUser.userId);

        // Step 2: Fetch user details for the extracted userIds
        const users = await User.findAll({
            where: { id: userIds },
            attributes: ['id', 'name', 'email'], // Fetch only required columns
        });

        // Step 3: Merge user details with group user data
        const response = groupUsers.map(groupUser => {
            const user = users.find(u => u.id === groupUser.userId); // Find corresponding user
            return {
                userId: groupUser.userId,
                userName: user ? user.name : null, // Handle missing users gracefully
                userEmail: user ? user.email : null,
                role: groupUser.role,
                createdBy: groupUser.createdBy,
                groupId: groupUser.groupId,
            };
        });

        res.status(200).json({ groupId, users: response });
    } catch (error) {
        console.error('Error fetching group users:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};