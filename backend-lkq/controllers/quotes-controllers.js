const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')
const getWiki = require('../util/get-wiki')

const Quote = require('../models/quote');
const User = require('../models/user');
const Author = require('../models/author');
const Tag = require('../models/tag');

// const fs = require('fs');


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

const getQuotesByAuthorId = async (req, res, next) => {
    const authorId = req.params.aid
    console.log(authorId);
    // let quotes;
    let authorWithQuotes;
    try {
        // quotes = await Quote.find({ creator: authorId });
        authorWithQuotes = await Author.findById(authorId).populate('quotes');
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    // if (!quotes || quotes.length <= 0) {
    if (!authorWithQuotes || authorWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with author id ‘${authorId}’ `, 404));
    } else {
        // return res.json({ quotes: quotes.map(quote => quote.toObject({ getters: true })) });
        return res.json({ quotes: authorWithQuotes.quotes.map(quote => quote.toObject({ getters: true })) });
    }
}

const createQuote = async (req, res, next) => {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     console.log(errors);
    //     return next(new HttpError(
    //         errors.errors.map(
    //             (e, i) => `${i === 0 ? "Validation error(s): " : " "}(${i + 1}) ${e.msg} for '${e.param}'`
    //         ), 422
    //     ))
    // }
    const { text, tags, author } = req.body;

    let authorInfo
    try {
        authorInfo = await getWiki(author);
    } catch (error) {
        return next(error);
    }
    
    

    console.log(authorInfo.name)

    
    
    let authorExisting;
    try {
        authorExisting = await Author.findOne({ name: authorInfo.name })
    } catch (error) {
        return next(new HttpError(error, 500));
    };
    console.log(authorExisting)
    if (!authorExisting) {
        console.log("write authorCreated")
        const authorCreated = new Author({
            name: authorInfo.name,
            ref_url: authorInfo.url,
            ref_img: authorInfo.img,  
            quotes: []
        });
        try {
            // const currentSession = await mongoose.startSession();
            // currentSession.startTransaction();
            await authorCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
            // authorExisiting.quotes.push(quoteCreated);
            // await user.save({ session: currentSession, validateModifiedOnly: true});
            // await currentSession.commitTransaction(); 
        } catch (error) {
            return next(new HttpError(error, 500));
        }
        authorExisting = authorCreated
    } else {
        console.log("Author already in db")
    };

    console.log("authorExisting", authorExisting)

    for (tag of tags) {
        let tagExisting;
        try {
            tagExisting = await Tag.findOne({ name: tag })
        } catch (error) {
            return next(new HttpError(error, 500));
        };
        console.log(tagExisting)
        if (!tagExisting) {
            console.log("write tagCreated")
            const tagCreated = new Tag({
                text: tag,
                quotes: []
            });
            try {
                // const currentSession = await mongoose.startSession();
                // currentSession.startTransaction();
                await tagCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
                // authorExisiting.quotes.push(quoteCreated);
                // await user.save({ session: currentSession, validateModifiedOnly: true});
                // await currentSession.commitTransaction(); 
            } catch (error) {
                return next(new HttpError(error, 500));
            }
            tagExisting = tagCreated
        } else {
            console.log("Tag already in db")
        };
    }
    
    
    
    // let currentUser = req.userData.userId
    let currentUser = '62a0ad936a49efdccea4a488'; /*  INITIAL VALUE TO TO TEST */
    
    const quoteCreated = new Quote({
        text,
        tags: tags.toString(),
        author: authorExisting._id,  
        creator: currentUser
    });
    

    let user;
    try {
        user = await User.findById(currentUser)
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    if (!user) {
        return next(new HttpError("Could not find user with the id provided"));
    }

    try {
        // const currentSession = await mongoose.startSession();
        // currentSession.startTransaction();
        await quoteCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
        user.quotes.push(quoteCreated);
        authorExisting.quotes.push(quoteCreated);
        await user.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
        await authorExisting.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
        // await currentSession.commitTransaction(); 
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
    // const imagePath = quote.image
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
    // fs.unlink(imagePath, error => { console.log(error) })

    
    return res.status(200).json({ message: `deleted quote “${quote.title}” (id: ${quoteId}) ` });

};


module.exports = {
    getQuoteById,
    getQuotesByUserId,
    getQuotesByAuthorId,
    createQuote,
    updateQuote,
    deleteQuote
};
