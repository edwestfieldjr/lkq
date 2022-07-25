const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')
const getWiki = require('../util/get-wiki')

const Quote = require('../models/quote');
const User = require('../models/user');
const Author = require('../models/author');
const Tag = require('../models/tag');
const { countDocuments } = require('../models/quote');

/* *  *   *    *     *      *       *        *        *         *          *          */
/* GETTING USER ID FROM ENV FILE FOR TESTING */
/* production 'currentUserId' id will be: req.userData.userId */
/* *  *   *    *     *      *       *        *        *         *          *          */

const currentUserIdAdminTest = async () => {
    let currentUser;
    try {
        currentUser = await User.findOne({ email: process.env.ADMIN_EMAIL_ADDR })
    } catch (error) {
        return error;
    }
    return await currentUser._id;
}

/* *  *   *    *     *      *       *        *        *         *          *          */



const getAllQuotes = async (req, res, next) => {
    // const quoteId = req.params.qid
    let allQuotes;
    try {
        allQuotes = await Quote.find().populate([{
            path: 'author',
            model: 'Author',
            select: 'name ref_url ref_img'
        }, {
            path: 'tags',
            model: 'Tag',
            select: 'name'
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }

    if (!allQuotes) {
        return next(new HttpError("No quotes found", 404))
    };
    return res.json({ quotes: allQuotes/* })//quotes */.map(quote => quote.toObject({ getters: true })) });
    // };
};

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
        return next(new HttpError(error));
    }

    if (!quote) {
        return next(new HttpError('couldn’t find this quote', 404))
    };
    return res.json({ quote: quote.toObject({ getters: true }) });
    // };
};

const getQuotesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    let userWithQuotes;
    try {
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
        return next(new HttpError(error));
    }
    if (!userWithQuotes || userWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with user id ‘${userId}’ `, 404));
    } else {
        return res.json({ quotes: userWithQuotes/* })//quotes */.map(quote => quote.toObject({ getters: true })) });
    }
}

const getQuotesByAuthorId = async (req, res, next) => {
    const authorId = req.params.aid
    let authorWithQuotes;
    try {
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
        return next(new HttpError(error));
    }
    if (!authorWithQuotes || authorWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with author id ‘${authorId}’ `, 404));
    } else {
        return res.json({ author: authorWithQuotes })//.quotes.map(quote => quote.toObject({ getters: true })) });
    }
}

const constructQuote = async (req, res, next) => {
    currentUserId = await currentUserIdAdminTest(); /* FOR TESTING !!!  */
    console.log(req.headers.authorization);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError(
            errors.errors.map(
                (e, i) => `${i === 0 ? "Validation error(s): " : " "}(${i + 1}) ${e.msg} for '${e.param}'`
            ), 422
        ))
    }

    const { text, author, tags } = req.body;

    let authorInfo
    try {
        authorInfo = await getWiki(author);
    } catch (error) {
        return next(new HttpError(error));
    }

    let authorExisting;
    try {
        authorExisting = await Author.findOne({ name: authorInfo.name })
    } catch (error) {
        return next(new HttpError(error));
    };
    if (!authorExisting) {
        const authorCreated = new Author({
            name: authorInfo.name,
            ref_url: authorInfo.url,
            ref_img: authorInfo.img,
            quotes: []
        });
        try {
            await authorCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
        } catch (error) {
            return next(new HttpError(error));
        }
        authorExisting = authorCreated
    };

    let textExisting;
    try {
        textExisting = await Quote.findOne({ text: text })
    } catch (error) {
        return next(new HttpError(error));
    };
   

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
        }, {
            path: 'creator',
            model: 'User',
            select: '_id'
        }]) || ((req.params.qid === undefined && !textExisting) && new Quote({
            text,
            tags: [],
            author: authorExisting._id,
            creator: currentUserId
        }));
    } catch (error) {
        console.log(error);
        return next(new HttpError(error));
    };

    let user;
    try {
        user = await User.findById(currentUserId)
    } catch (error) {
        return next(new HttpError(error));
    }
    if (!user) {
        return next(new HttpError("Could not find user with the id provided"));
    } else if (req.params.qid !== undefined && user._id.toString() !== quoteConstructed.creator._id.toString()) {
        return next(new HttpError("Unauthorized to edit this quote", 401));
    }

    try {
        if (!(user.quotes.includes(quoteConstructed._id))) { user.quotes.push(quoteConstructed); }
        if (!(authorExisting.quotes.includes(quoteConstructed._id))) { authorExisting.quotes.push(quoteConstructed); }
        await user.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
        await authorExisting.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
    } catch (error) {
        return next(new HttpError(error));
    }

    let previousTags, previousAuthor;
    try {
        if (req.params.qid !== undefined) {
            previousTags = quoteConstructed.tags;
            previousAuthor = quoteConstructed.author;
        }
    } catch (error) {
        return next(new HttpError(error));
    }


    const quoteConstructedNewTags = [];
    if (tags) {
        let tagExisting, tagCreated;
        for (tag of tags) {
            tagExisting = tagCreated = await null;
            try {
                tagExisting = null
                tagExisting = await Tag.findOne({ name: tag }).exec()
            } catch (error) {
                return next(new HttpError(error));
            }
            if (!tagExisting) {
                try {
                    tagCreated = await new Tag({
                        name: tag,
                        quotes: [quoteConstructed._id]
                    });
                    await tagCreated.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);

                } catch (error) {
                    return next(new HttpError(error));
                }
                tagExisting = tagCreated
            } else {
                if (!(tagExisting.quotes.includes(quoteConstructed._id))) { tagExisting.quotes.push(quoteConstructed); }
            }

            try {
                quoteConstructedNewTags.push(tagExisting._id)
                await tagExisting.save(/*{ session: currentSession, validateModifiedOnly: true}*/);
            } catch (error) {
                return next(new HttpError(error));
            }
        }
    }

    /* Remove 'quote._id' references from the appropriate author and tag records */
    console.log("quoteCreatedNewTags: " + quoteConstructedNewTags)
    if (req.params.qid !== undefined) {
        previousAuthorId = previousAuthor._id.toString() !== authorExisting._id.toString() ? previousAuthor._id : null;
        previousTagsIds = previousTags.map(e => e._id).filter(f => !(quoteConstructedNewTags.map(g => g.toString()).includes(f.toString())));

        try {
            if (previousAuthorId) {
                await Author.updateOne(
                    { _id: mongoose.Types.ObjectId(previousAuthorId.toString()) },
                    { $pull: { 'quotes': quoteConstructed._id.toString() } },
                    { returnNewDocument: true, returnOriginal: false }
                );
            }
        } catch (error) {
            return next(new HttpError(error));
        }

        for (prevTagId of previousTagsIds) {
            try {
                await Tag.updateOne(
                    { _id: mongoose.Types.ObjectId(prevTagId.toString()) },
                    { $pull: { 'quotes': quoteConstructed._id.toString() } },
                    { returnNewDocument: true, returnOriginal: false }
                );
            } catch (error) {
                return next(new HttpError(error));
            }
        }
    }


    try {
        quoteConstructed.tags = quoteConstructedNewTags
        if (req.params.qid !== undefined) {
            quoteConstructed.text = text;
            quoteConstructed.author = authorExisting._id;
        }
        await quoteConstructed.save(/*{ session: currentSession,  validateModifiedOnly: true}*/);
    } catch (error) {
        return next(new HttpError(error));
    }

    return res.status(201).json({ quote: quoteConstructed });
}


const deleteQuote = async (req, res, next) => {
    currentUserId = await currentUserIdAdminTest() /* FOR TESTING !!!  */
    const quoteId = req.params.qid
    let quote, author, tags, creator;

    try {
        quote = await Quote.findById(quoteId)//.populate('creator').populate('author').populate('tags');
    } catch (error) {
        return next(new HttpError(error));
    }

    [author, tags, creator] = [quote.author, quote.tags, quote.creator];

    console.log("Delete quote: " + quote);

    if (!quote) {
        return next(new HttpError("Could not find quote with the id provided", 404));
    }
    if (creator && creator.toString() !== /* req.userData.userId */currentUserId.toString()) {
        return next(new HttpError("Unauthorized to Delete", 401));
    }

    try {
        await Quote.findOneAndDelete({ id: quoteId })
    } catch (error) {
        return next(new HttpError(error));
    }


    try {
        await Author.updateOne(
            { _id: mongoose.Types.ObjectId(author.toString()) },
            { $pull: { 'quotes': quoteId.toString() } },
            { returnNewDocument: true, returnOriginal: false }
        );
    } catch (error) {
        return next(new HttpError(error));
    }

    for (tag of tags) {
        try {
            await Tag.updateOne(
                { _id: mongoose.Types.ObjectId(tag.toString()) },
                { $pull: { 'quotes': quoteId.toString() } },
                { returnNewDocument: true, returnOriginal: false }
            );
        } catch (error) {
            return next(new HttpError(error));
        }
    }


    return res.status(200).json({ message: `deleted quote “${quote.title}” (id: ${quoteId}) ` });

};


module.exports = {
    getAllQuotes,
    getQuoteById,
    getQuotesByUserId,
    getQuotesByAuthorId,
    constructQuote,
    deleteQuote
};
