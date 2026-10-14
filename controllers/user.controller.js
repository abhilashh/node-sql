const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('fastest-validator');

const userSchema = {
    name: { type: 'string', min: 2, max: 100 },
    email: { type: 'email' },
    password: {
        type: 'string',
        min: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/
    }
};

const v = new validator();

async function signup(req, res) {
    const { name, email, password } = req.body;
    const user = { name, email, password };

    const validationResult = v.validate(user, userSchema);
    if (validationResult !== true) {
        return res.status(400).json({ error: 'Validation failed', details: validationResult });
    }

    try {
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // bcrypt.hash generates salt internally — no need for genSalt
        const hash = await bcrypt.hash(password, 10);
        const newUser = await models.User.create({ name, email, password: hash });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
}

function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    models.User.findOne({ where: { email } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(401).json({ error: 'Invalid password' });
                    }

                    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
                    return res.status(200).json({ message: 'Login successful', token });
                })
                .catch(err => {
                    return res.status(500).json({ error: 'Error comparing passwords', details: err.message });
                });
        })
        .catch(err => {
            return res.status(500).json({ error: 'Error finding user', details: err.message });
        });
}
//
module.exports = {
    signup: signup,
    login: login
};
