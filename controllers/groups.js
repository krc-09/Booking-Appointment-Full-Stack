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

        // Step 2: Add the creator and selected users to the GroupUser table
        const groupUsersData = [
            { groupId: group.id, userId: req.user.id, createdBy: req.user.name }, // Add the creator
            ...users.map(userId => ({
                groupId: group.id,
                userId: userId,
                createdBy: req.user.name
            }))
        ];

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


// exports.getgroupDetails = async (req, res, next) => {
//    try{

//         const groups = await Group.findAll(
//             {attributes:['id','createdBy']})


      
//         res.status(200).json(groups);

//     } catch (err) {
//         console.error('Error fetching groups:', err);
//         res.status(500).json({ error: 'An error occurred while fetching groups' });
//     }
// };
