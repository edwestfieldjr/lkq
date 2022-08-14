const express = require("express");
const { check } = require('express-validator');

const {
    getAllQuotes,
    getQuoteById,
    getQuotesByUserId,
    getQuotesByTagId,
    getQuotesByAuthorId,
    getQuotesBySearchTerm,
    constructQuote,
    deleteQuote
} = require('../controllers/quotes-controllers')

const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const inputValidator = [
    check('text')
        .not()
        .isEmpty(),
];

router.get("/", getAllQuotes);

router.get("/:qid", getQuoteById);

router.get("/user/:uid", getQuotesByUserId);

router.get("/tag/:tid", getQuotesByTagId);

router.get("/author/:aid", getQuotesByAuthorId);

router.get("/search/:term", getQuotesBySearchTerm);

router.post("/", checkAuth, inputValidator, constructQuote);

router.patch("/:qid", checkAuth, inputValidator, constructQuote);

router.delete("/:qid", checkAuth, deleteQuote);

module.exports = router;