const GroupUser = require('../MODELS/GroupUser'); 
// Assuming you have a GroupUser model
const Group = require('../MODELS/groups');


exports.addUsersToGroup = async (req, res) => {
     const { name, email, password,phone } = req.body;

  
    if (!name) {
        return res.status(400).json({ error: 'Name is mandatory' });
    }
    if (!email) {
        return res.status(400).json({ error: 'Email is mandatory' });
    }
    if (!phone) {
        return res.status(400).json({ error: 'Phone is mandatory' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is mandatory' });
    }

    try {
     
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
       
        await  Users.create({ name, email, password: hashedPassword,phone });


     
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
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


