const express = require("express");
const { check } = require('express-validator');


const { 
    getQuoteById, 
    getQuotesByUserId,
    getQuotesByAuthorId, 
    constructQuote, 
    updateQuote, 
    deleteQuote 
} = require('../controllers/quotes-controllers')

const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth');

const router = express.Router();



// router.get("/", allAll);

router.get("/:qid", getQuoteById);

router.get("/user/:uid", getQuotesByUserId);

router.get("/author/:aid", getQuotesByAuthorId);

//auth token middlware
// router.use(checkAuth);

router.post("/",
    // fileUpload.single('image'),
    [
        check('text')
            .not()
            .isEmpty(), 
        check('author')
            .isLength({min: 2}), 
    ], 
constructQuote);

router.patch("/:qid", 
    [
        check('text')
            .not()
            .isEmpty(), 
        check('author')
            .isLength({min: 2}) 
    ],
constructQuote);

router.delete("/:qid", deleteQuote);

module.exports = router;