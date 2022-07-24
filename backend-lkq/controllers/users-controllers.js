const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')
const User = require('../models/user')
const { check } = require('express-validator');
const bcryptjs = require('bcryptjs')
const JSONWebToken = require('jsonwebtoken')


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (error) {
        return next(new HttpError(error));
    }
    return res.json({ users: users.map(user => user.toObject({ getters: true })) });


};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return next(new HttpError(
            errors.errors.map(
                (e, i) => `${i === 0 ? "Validation error(s): " : " "}(${i + 1}) ${e.msg} for '${e.param}'`
            ), 422
        ))
    }
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log("error triggered")
        return next(new HttpError(error))
    };
    if (existingUser) {
        return next(new HttpError("The username is invalid...", 422))
    };


    let hashedPassword;
    try {
        hashedPassword = await bcryptjs.hash(password, 16)
    } catch (error) {
        return next(new HttpError(error));
    }


    
    const userCreated = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        quotes: []
    });

    let token;
    try {
        token = JSONWebToken.sign(
            {
                userId: userCreated.id,
                email: userCreated.email
            },
            process.env.SECRET,
            { expiresIn: '4h' }
        );
    } catch (error) {
        return next(new HttpError(error))
    };

    userCreated.confirmationCode = token;

    if (userCreated.email = process.env.ADMIN_EMAIL_ADDR.toLowerCase()) {
        userCreated.isAdmin = true;
        userCreated.status ='Active';
    }

    try {
        await userCreated.save();
    } catch (error) {
        return next(new HttpError(error));
    }

    return res.status(201).json({ userId: userCreated.id, email: userCreated.email, token: userCreated.confirmationCode })
};

const login = async (req, res, next) => {
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        return next(new HttpError(error))
    };

    if (!existingUser) {
        return next(new HttpError("invalid credentials...", 422))
    } else {
        let isValidPassword = false;
        try {
            isValidPassword = await bcryptjs.compare(password, existingUser.password);
        } catch (error) {
            return next(new HttpError(error, 422))
        };

        if (isValidPassword) {
            let token;
            try {
                token = JSONWebToken.sign(
                    {
                        userId: existingUser.id,
                        email: existingUser.email
                    },
                    process.env.SECRET,
                    { expiresIn: '4h' }
                );
            } catch (error) {
                return next(new HttpError(error));
            };
            return res.json({ message: `Logged in as: ${email}`, existingUser: existingUser.toObject({ getters: true }) });
            // return res.status(201).json({ userId: existingUser.id, email: existingUser.email, token: token });
        } else {
            return next(new HttpError("Fail to Authenticate error", 401));
        }
    };




};

module.exports = { getUsers, signup, login };

