const Users = require('../MODELS/users');
const sequelize = require('../utils/database');
const bcrypt = require('bcrypt');


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
