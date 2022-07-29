const express = require("express");
const { check } = require('express-validator');


const { 
    getAllQuotes,
    getQuoteById, 
    getQuotesByUserId,
    getQuotesByAuthorId, 
    constructQuote, 
    deleteQuote 
} = require('../controllers/quotes-controllers')

const checkAuth = require('../middleware/check-auth');

const router = express.Router();


// router.get("/666", (req, res, next) => {
//     res.status(666).json({ message: "Not found: " + process.env.ADMIN_EMAIL_ADDR });
// });


router.get("/", getAllQuotes);

router.get("/:qid", getQuoteById);

router.get("/user/:uid", getQuotesByUserId);

router.get("/author/:aid", getQuotesByAuthorId);

router.use(checkAuth); /* auth token middleware */

router.post("/",
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