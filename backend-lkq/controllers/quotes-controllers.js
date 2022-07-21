const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')
const getWiki = require('../util/get-wiki')

const Quote = require('../models/quote');
const User = require('../models/user');
const Author = require('../models/author');
const Tag = require('../models/tag');
const { countDocuments } = require('../models/quote');

// const fs = require('fs');


const currentUser = '62d4756f5019a7d58d2e3f0d'; /*  INITIAL API TESTING VALUE FROM DB  */




const getQuoteById = async (req, res, next) => {
    const quoteId = req.params.qid
    let quote;
    try {
        quote = await Quote.findById(quoteId).populate([{
            path: 'author',
            model: 'Author',
            select: 'name ref_url ref_img'
        }, {
            path: 'tags',
            model: 'Tag',
            select: 'name'
        }]);
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
    // console.log(userId);
    // let quotes;
    let userWithQuotes;
    try {
        // quotes = await Quote.find({ creator: userId });
        userWithQuotes = await User.findById(userId).select('-password').populate([{
            path: 'quotes',
            model: 'Quote',
            select: 'text',
            populate: {
                path: 'tags',
                model: 'Tag',
                select: 'name',
            }

        }]);
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    // if (!quotes || quotes.length <= 0) {
    if (!userWithQuotes || userWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with user id ‘${userId}’ `, 404));
    } else {
        // return res.json({ quotes: quotes.map(quote => quote.toObject({ getters: true })) });
        return res.json({ quotes: userWithQuotes/* })//quotes */.map(quote => quote.toObject({ getters: true })) });
    }
}

const getQuotesByAuthorId = async (req, res, next) => {
    const authorId = req.params.aid
    // console.log(authorId);
    // let quotes;
    let authorWithQuotes;
    try {
        // quotes = await Quote.find({ creator: authorId });
        authorWithQuotes = await Author.findById(authorId)/*.populate('name')*/.populate.populate([{
            path: 'quotes',
            model: 'Quote',
            select: 'text',
            populate: {
                path: 'tags',
                model: 'Tag',
                select: 'name',
            }
        }]);
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    // if (!quotes || quotes.length <= 0) {
    if (!authorWithQuotes || authorWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with author id ‘${authorId}’ `, 404));
    } else {
        // return res.json({ quotes: quotes.map(quote => quote.toObject({ getters: true })) });
        return res.json({ author: authorWithQuotes })//.quotes.map(quote => quote.toObject({ getters: true })) });
    }
}

const constructQuote = async (req, res, next) => {
    
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     console.log(errors);
    //     return next(new HttpError(
    //         errors.errors.map(
    //             (e, i) => `${i === 0 ? "Validation error(s): " : " "}(${i + 1}) ${e.msg} for '${e.param}'`
    //         ), 422
    //     ))
    // }

    const { text, author, tags } = req.body;


    // console.log("author: " + author);
    let authorInfo
    try {
        authorInfo = await getWiki(author);
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    
    

    // console.log(authorInfo.name)

    
    
    let authorExisting;
    try {
        authorExisting = await Author.findOne({ name: authorInfo.name })
    } catch (error) {
        return next(new HttpError(error, 500));
    };
    // console.log(authorExisting)
    if (!authorExisting) {
        // console.log("write authorCreated")
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
        // console.log("Author already in db")
    };

    // console.log("authorExisting", authorExisting)


    
    
    // let currentUser = req.userData.userId
    // let currentUser = '62d4756f5019a7d58d2e3f0d'; /*  INITIAL VALUE TO TO TEST */
    
    // console.log(req.params.qid)

    let quoteConstructed
    try {
        quoteConstructed = await Quote.findById(req.params.qid).populate([{
            path: 'author',
            model: 'Author',
            select: 'name ref_url ref_img quotes'
        }, {
            path: 'tags',
            model: 'Tag',
            select: 'name quotes'
        }]) || (req.params.qid === undefined && new Quote({
            text,
            tags: [],
            author: authorExisting._id,  
            creator: currentUser
        }));
    } catch (error) {
        console.log(error);
        return next(new HttpError(error, 500));
    };

    // console.log("quoteCreated", quoteCreated)


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
        if (!(user.quotes.includes(quoteConstructed._id))) { user.quotes.push(quoteConstructed); }
        if (!(authorExisting.quotes.includes(quoteConstructed._id))) { authorExisting.quotes.push(quoteConstructed); }
        await user.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
        await authorExisting.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
        // await currentSession.commitTransaction(); 
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    let previousTags, previousAuthor;
    try {
        if (req.params.qid !== undefined) { 
            previousTags = quoteConstructed.tags; 
            previousAuthor = quoteConstructed.author; 
        }
        // await quoteCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    // console.log("previousTags: " + previousTags)

    const quoteCreatedNewTags = [];

    if (tags) {    
        let tagExisting, tagCreated;
        for (tag of tags) {
            tagExisting = tagCreated = await null;
            try {
                tagExisting = null
                // console.log("TAAGGGGGG", tag, tagExisting)
                tagExisting = await Tag.findOne({ name: tag }).exec()
                // console.log("TAAGGGGGG", tag, tagExisting)
            } catch (error) {
                return next(new HttpError(error, 500));                   
            }
            if (!tagExisting) {
                // console.log("write tagCreated")
                try {
                    tagCreated = await new Tag({
                        name: tag,
                        quotes: [quoteConstructed._id]
                    });
                    await tagCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
                    
                } catch (error) {
                    return next(new HttpError(error, 500));
                }
                
                // try {
                    // const currentSession = await mongoose.startSession();
                    // currentSession.startTransaction();
                // await tagCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
                    // authorExisiting.quotes.push(quoteCreated);
                    // await user.save({ session: currentSession, validateModifiedOnly: true});
                    // await currentSession.commitTransaction(); 
                tagExisting = tagCreated
            } else {
                // console.log("Tag already in db")
                // try {
                    if (!(tagExisting.quotes.includes(quoteConstructed._id))) { tagExisting.quotes.push(quoteConstructed); }
                // } catch (error) {
                //     return next(new HttpError(error, 500));
                // }
            }
            // } catch (error) {
            //     return next(new HttpError(error, 500));
            // };
            try {
                quoteCreatedNewTags.push(tagExisting._id)
                await tagExisting.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
            } catch (error) {
                return next(new HttpError(error, 500));
            }
        } 
    }

    /* Remove 'quote._id' refernce from the approprate author and tag(s) */
    console.log("quoteCreatedNewTags: " + quoteCreatedNewTags)
    if (req.params.qid !== undefined) { 
        previousAuthorId = previousAuthor._id.toString() !== authorExisting._id.toString() ? previousAuthor._id : null;
        previousTagsIds = previousTags.map(e => e._id).filter(f => !(quoteCreatedNewTags.map(g => g.toString()).includes(f.toString())));
        
        let previousAuthorSave, previousTagSave
        try {
            if (previousAuthorId) {
                previousAuthorSave = null
                previousAuthorSave = await Author.updateOne(
                    { _id: mongoose.Types.ObjectId(previousAuthorId.toString()) }, 
                    { $pull: { 'quotes': quoteConstructed._id.toString() } }, 
                    { returnNewDocument: true, returnOriginal: false }
                );
                console.log(previousAuthorSave);
                previousAuthorSave
            }
        } catch (error) {
            return next(new HttpError(error, 500));     
        }

        for (prevTagId of previousTagsIds) {
            try {
                previousTagSave = null
                previousTagSave = await Tag.updateOne(
                    { _id: mongoose.Types.ObjectId(prevTagId.toString()) }, 
                    { $pull: { 'quotes': quoteConstructed._id.toString() } }, 
                    { returnNewDocument: true, returnOriginal: false }
                );
                // previousTagSave.save();
            } catch (error) {
                return next(new HttpError(error, 500));     
            }
        }

        // console.log(previousAuthor)
        // for (prevTag of previousTags) {
        //     console.log(prevTag)
        // }   
    }


    try {
        quoteConstructed.tags = quoteCreatedNewTags
        if (req.params.qid !== undefined) { 
            quoteConstructed.text = text; 
            quoteConstructed.author = authorExisting._id; 
        }
        await quoteConstructed.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
    } catch (error) {
        return next(new HttpError(error, 500));
    }

        

    return res.status(201).json({ quote: quoteConstructed });

}

const updateQuote = async (req, res, next) => {
    const { text, tags } = req.body;
    const quoteId = req.params.qid

    // console.log(text, tags, quoteId, req.userData)

    let quote
    try {
        quote = await Quote.findById(quoteId);
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    // console.log(text, quote)

    // if (quote.creator.toString() !== req.userData.userId) {
    //     return next(new HttpError("Unauthorized to Edit", 401));
    // }
    
    // quote.title = title;
    // quote.description = description;

    // try {
    //     await quote.save();
    // } catch (error) {
    //     return next(new HttpError(error, 500));
    // }
    

    
    // return res.status(200).json({ quote: quote.toObject({getters: true}) });

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
    constructQuote,
    updateQuote,
    deleteQuote
};
