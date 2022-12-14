const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')
const User = require('../models/user')
const normalizeEmail = require('normalize-email');
const bcryptjs = require('bcryptjs')
const JSONWebToken = require('jsonwebtoken')


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password -email');
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




    if (normalizeEmail(userCreated.email.toLowerCase()) === normalizeEmail(process.env.ADMIN_EMAIL_ADDR.toLowerCase())) {
        userCreated.isAdmin = true;
    }

    try {
        await userCreated.save();
    } catch (error) {
        return next(new HttpError(error));
    }

    let token;
    try {
        token = JSONWebToken.sign(
            {
                name: userCreated.name,
                userId: userCreated.id,
                email: userCreated.email,
            },
            process.env.SECRET,
            { expiresIn: '4h' }
        );
    } catch (error) {
        return next(new HttpError(error))
    };

    return res.status(201).json({ userId: userCreated.id, name: userCreated.name, email: userCreated.email, isAdmin: userCreated.isAdmin, token: token })
};

const login = async (req, res, next) => {

    const email = normalizeEmail(req.body.email), password = req.body.password;



    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        return next(new HttpError(error))
    };

    if (!existingUser) {
        return next(new HttpError("The user account does not exists: Press 'Switch to Sign UP' to create an account. ", 404))
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
            //return res.json({ message: `Logged in as: ${email}`, existingUser: existingUser.toObject({ getters: true }) });
            return res.status(201).json({ userId: existingUser.id, name: existingUser.name, email: existingUser.email, isAdmin: existingUser.isAdmin, token: token })
        } else {
            return next(new HttpError("Fail to Authenticate error", 401));
        }
    };




};

module.exports = { getUsers, signup, login };

