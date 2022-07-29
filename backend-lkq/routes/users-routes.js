const express = require("express");
const { check } = require('express-validator');

const {getUsers, signup, login} = require('../controllers/users-controllers')

const router = express.Router();



router.get("/", getUsers);

router.post(
    "/signup", 
    [
        check('name')
            .not()
            .isEmpty(), 
        check('email')
            .isEmail()    
            .normalizeEmail(),
        check('password')
            .isLength({ min: 8 }), 
    ], 
    signup
);

router.post("/login", 
    [
        check('email')
            .isEmail()
            .normalizeEmail(),
    ], 
    login
);


module.exports = router;