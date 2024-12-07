const Users = require('../MODELS/users');
const sequelize = require('../utils/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


exports.postSignupDetails = async (req, res, next) => {
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

function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},'TOKEN_SECRET')
}
exports.postLoginDetails = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is mandatory for login' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is mandatory for login' });
    }

    try {
      
        const user = await Users.findOne({ where: { email: email } });
        if (!user) {
         
            return res.status(404).json({ error: 'User not found' });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
       
            return res.status(401).json({ error: 'Invalid email or password' });
        }

    
        res.status(200).json({ message: 'User login successful',token:generateAccessToken(user.id,user.name)});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
exports.getLoggedinDetails = async (req, res, next) => {
    try {
        // Fetch all users (you can add logic to filter by logged-in status if necessary)
        const users = await Users.findAll({
            attributes: ['name','id','phone','email'],  // Select only required fields
            order: [['createdAt', 'DESC']],
        });

        // Send the users list as a response
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching logged-in users:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.searchUsers = async (req, res) => {
    const { query } = req.query; // Search query

    try {
        // Search users by name, email, or phone
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { phone: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
