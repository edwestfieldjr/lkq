const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')

const Quote = require('../models/quote');
const User = require('../models/user');

const fs = require('fs');


const getQuoteById = async (req, res, next) => {
    const quoteId = req.params.pid

    let quote;
    try {
        quote = await Quote.findById(quoteId);
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    if (!quote) {
        return next(new HttpError('couldn’t find this quote', 404))
    };
    return res.json({ quote: quote.toObject({ getters: true }) });
    // };
};

const getQuotesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    console.log(userId);
    // let quotes;
    let userWithQuotes;
    try {
        // quotes = await Quote.find({ creator: userId });
        userWithQuotes = await User.findById(userId).populate('quotes');
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    // if (!quotes || quotes.length <= 0) {
    if (!userWithQuotes || userWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with user id ‘${userId}’ `, 404));
    } else {
        // return res.json({ quotes: quotes.map(quote => quote.toObject({ getters: true })) });
        return res.json({ quotes: userWithQuotes.quotes.map(quote => quote.toObject({ getters: true })) });
    }
}

const createQuote = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError(
            errors.errors.map(
                (e, i) => `${i === 0 ? "Validation error(s): " : " "}(${i + 1}) ${e.msg} for '${e.param}'`
            ), 422
        ))
    }
    const { title, description, address } = req.body;

    let geoCode
    try {
        geoCode = await getCoordsForAddress(address)
    } catch (error) {
        return next(error);
    }

    const quoteCreated = new Quote({
        title,
        description,
        address: await geoCode.addr,
        location: await geoCode.coords,
        image: req.file.path,  
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId)
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    if (!user) {
        return next(new HttpError("Could not find user with the id provided"));
    }

    try {
        const currentSession = await mongoose.startSession();
        currentSession.startTransaction();
        await quoteCreated.save({ session: currentSession,  validateModifiedOnly: true});
        user.quotes.push(quoteCreated);
        await user.save({ session: currentSession, validateModifiedOnly: true});
        await currentSession.commitTransaction(); 
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    return res.status(201).json({ quote: quoteCreated });

}

const updateQuote = async (req, res, next) => {
    const { title, description } = req.body;
    const quoteId = req.params.pid

    let quote
    try {
        quote = await Quote.findById(quoteId);
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    if (quote.creator.toString() !== req.userData.userId) {
        return next(new HttpError("Unauthorized to Edit", 401));
    }
    
    quote.title = title;
    quote.description = description;

    try {
        await quote.save();
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    

    
    return res.status(200).json({ quote: quote.toObject({getters: true}) });

};

const deleteQuote = async (req, res, next) => {
    const quoteId = req.params.pid
    let quote
    try {
        quote = await Quote.findById(quoteId).populate('creator');
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    if (!quote) {
        return next(new HttpError("Could not find quote with the id provided", 404));
    }
    if (quote.creator.id && quote.creator.id !== req.userData.userId) {
        return next(new HttpError("Unauthorized to Delete", 401));
    }
    const imagePath = quote.image
    try {
        const currentSession = await mongoose.startSession();
        currentSession.startTransaction();
        await quote.remove({ session: currentSession, validateModifiedOnly: true});
        quote.creator.quotes.pull(quote);
        await quote.creator.save({ session: currentSession, validateModifiedOnly: true});
        await currentSession.commitTransaction(); 
        await quote.remove();
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    fs.unlink(imagePath, error => { console.log(error) })

    
    return res.status(200).json({ message: `deleted quote “${quote.title}” (id: ${quoteId}) ` });

};


module.exports = {
    getQuoteById,
    getQuotesByUserId,
    createQuote,
    updateQuote,
    deleteQuote
};
