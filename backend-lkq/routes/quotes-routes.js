const express = require("express");
const { check } = require('express-validator');


const { 
    getAllQuotes,
    getQuoteById, 
    getQuotesByUserId,
    getQuotesByTagId,
    getQuotesByAuthorId, 
    constructQuote, 
    deleteQuote 
} = require('../controllers/quotes-controllers')

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// 'GET' route(s)

router.get("/", getAllQuotes);

router.get("/:qid", getQuoteById);

router.get("/user/:uid", getQuotesByUserId);

router.get("/tag/:tid", getQuotesByTagId);

router.get("/author/:aid", getQuotesByAuthorId);

router.use(checkAuth); 

const userAuth = [
    check('text')
        .not()
        .isEmpty(), 
];

// 'POST' route(s)

router.post("/", userAuth, constructQuote);

// 'PATCH' route(s)

router.patch("/:qid", userAuth, constructQuote);

// 'DELETE' route(s)

router.delete("/:qid", deleteQuote);

module.exports = router;