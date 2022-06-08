const express = require("express");
const { check } = require('express-validator');


const { 
    getQuoteById, 
    getQuotesByUserId, 
    createQuote, 
    updateQuote, 
    deleteQuote 
} = require('../controllers/quotes-controllers')

const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth');

const router = express.Router();



// router.get("/", allAll);

router.get("/:qid", getQuoteById);

router.get("/user/:uid", getQuotesByUserId);

router.get("/user/:aid", getQuotesByUserId);

//auth token middlware
router.use(checkAuth);

router.post("/",
    fileUpload.single('image'),
    [
        check('title')
            .not()
            .isEmpty(), 
        check('description')
            .isLength({min: 5}), 
    ], 
createQuote);

router.patch("/:qid", 
    [
        check('text')
            .not()
            .isEmpty(), 
        check('author')
            .isLength({min: 5}) 
    ],
updateQuote);

router.delete("/:qid", deleteQuote);

module.exports = router;