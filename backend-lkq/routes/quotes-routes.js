const express = require("express");
const { check } = require('express-validator');

const { 
    getAllQuotes,
    getQuoteById, 
    getQuotesByUserId,
    getQuotesByTagId,
    getQuotesByAuthorId, 
    getQuotesBySearchTerm, 
    getParamName,
    constructQuote, 
    deleteQuote 
} = require('../controllers/quotes-controllers')

// ROUTER INIT

const router = express.Router();

// middleware config: 

const checkAuth = require('../middleware/check-auth');

const inputValidator = [
    check('text')
        .not()
        .isEmpty(), 
];

// 'GET' route(s)

router.get("/", getAllQuotes);

router.get("/:qid", getQuoteById);

router.get("/user/:uid", getQuotesByUserId);

router.get("/tag/:tid", getQuotesByTagId);

router.get("/author/:aid", getQuotesByAuthorId);

router.get("/search/:term", getQuotesBySearchTerm);

router.get("/getparam/:paramtype/:paramid", getParamName);

// 'POST' route(s)

router.post("/", checkAuth, inputValidator, constructQuote);

// 'PATCH' route(s)

router.patch("/:qid", checkAuth, inputValidator, constructQuote);

// 'DELETE' route(s)

router.delete("/:qid", checkAuth, deleteQuote);



module.exports = router;