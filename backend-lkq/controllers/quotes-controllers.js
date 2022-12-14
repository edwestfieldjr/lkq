const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../util/http-error')
const getWiki = require('../util/get-wiki')
const normalizeEmail = require('normalize-email');

const Quote = require('../models/quote');
const User = require('../models/user');
const Author = require('../models/author');
const Tag = require('../models/tag');


const getAdminIds = async () => {
    let adminUser;
    try {
        adminUser = await User.find({ 'isAdmin': 'true' })
    } catch (error) {
        return error;
    }
    return await adminUser.map(e => e._id.toString());
}



const getAllQuotes = async (req, res, next) => {

    let allQuotes;
    try {
        allQuotes = await Quote.find().populate([{
            path: 'author',
            model: 'Author',
            select: '_id name ref_url ref_img'
        }, {
            path: 'tags',
            model: 'Tag',
            select: '_id name'
        }, {
            path: 'creator',
            model: 'User',
            select: '_id name'
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }

    if (!allQuotes) {
        return next(new HttpError("No quotes found", 404))
    };
    return res.json({ header: "All Quotes", quotes: allQuotes.map(quote => quote.toObject({ getters: true })) });
};

const getQuoteById = async (req, res, next) => {
    const quoteId = req.params.qid
    let quote;
    try {
        quote = await Quote.findById(quoteId).populate([{
            path: 'author',
            model: 'Author',
            select: '_id name ref_url ref_img'
        }, {
            path: 'tags',
            model: 'Tag',
            select: '_id name'
        }, {
            path: 'creator',
            model: 'User',
            select: '_id name'
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }

    if (!quote) {
        return next(new HttpError('couldn’t find this quote', 404))
    } else {
        try {
            return res.json({ header: null, quote: quote.toObject({ getters: true }) });
        } catch (error) {
            return next(new HttpError(error));
        }
    }
};

const getQuotesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    let userWithQuotes;
    try {
        userWithQuotes = await User.findById(userId).select('-password').populate([{
            path: 'quotes',
            model: 'Quote',
            select: '_id text isPublic __v id',
            populate: [
                {
                    path: 'author',
                    model: 'Author',
                    select: '_id name ref_url ref_img'
                },
                {
                    path: 'tags',
                    model: 'Tag',
                    select: '_id name'
                },
                {
                    path: 'creator',
                    model: 'User',
                    select: '_id name'
                }
            ]
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }
    if (!userWithQuotes || userWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No quotations associated with user: ${userWithQuotes.name} `, 404));
    } else {
        try {
            return res.json({ header: `Quotes posted by user: ${userWithQuotes.name}`, quotes: userWithQuotes.quotes.map(quote => quote.toObject({ getters: true })) });
        } catch (error) {
            return next(new HttpError(error));
        }
    }
}
const getQuotesByTagId = async (req, res, next) => {
    const tagId = req.params.tid
    let tagWithQuotes;
    try {
        tagWithQuotes = await Tag.findById(tagId).populate([{
            path: 'quotes',
            model: 'Quote',
            select: '_id text isPublic __v id',
            populate: [
                {
                    path: 'author',
                    model: 'Author',
                    select: '_id name ref_url ref_img'
                },
                {
                    path: 'tags',
                    model: 'Tag',
                    select: '_id name'
                },
                {
                    path: 'creator',
                    model: 'User',
                    select: '_id name'
                }
            ]
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }

    try {
        if (!tagWithQuotes || tagWithQuotes.quotes.length <= 0) {
            return next(new HttpError(`No documents associated with user id ‘${userId}’ `, 404));
        } else {
            return res.json({ header: `Quotes with the tag: “${tagWithQuotes.name}”`, quotes: tagWithQuotes.quotes.map(quote => quote.toObject({ getters: true })) });
        }
    } catch (error) {
        return next(new HttpError(error));
    }

}

const getQuotesByAuthorId = async (req, res, next) => {
    const authorId = req.params.aid
    let authorWithQuotes;
    try {
        authorWithQuotes = await Author.findById(authorId)/*.populate('name')*/.populate([{
            path: 'quotes',
            model: 'Quote',
            select: '_id text isPublic __v id',
            populate: [
                {
                    path: 'author',
                    model: 'Author',
                    select: '_id name ref_url ref_img'
                },
                {
                    path: 'tags',
                    model: 'Tag',
                    select: '_id name',
                },
                {
                    path: 'creator',
                    model: 'User',
                    select: '_id name'
                }
            ]
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }
    if (!authorWithQuotes || authorWithQuotes.quotes.length <= 0) {
        return next(new HttpError(`No documents associated with author id ‘${authorId}’ `, 404));
    } else {
        try {
            return res.json({ header: `Quotations by: ${authorWithQuotes.name}` , quotes: authorWithQuotes.quotes.map(quote => quote.toObject({ getters: true })) });

        } catch (error) {
            return next(new HttpError(error));
        }
    }
}

const getQuotesBySearchTerm = async (req, res, next) => {
    let searchResults = []
    try {
        searchResults = await Quote.find(
            { "text": { "$regex": req.params.term, "$options": "i" } }
        ).populate([{
            path: 'author',
            model: 'Author',
            select: '_id name ref_url ref_img'
        }, {
            path: 'tags',
            model: 'Tag',
            select: '_id name'
        }, {
            path: 'creator',
            model: 'User',
            select: '_id name'
        }]);
    } catch (error) {
        return next(new HttpError(error));
    }

    let schemaSearchResults
    for (let schemaFind of [Author, Tag]) {
        try {
            schemaSearchResults = await schemaFind.find(
                { "name": { "$regex": req.params.term, "$options": "i" } }
            ).populate({
                path: 'quotes',
                model: 'Quote',
                select: '_id text isPublic __v id',
                populate: [
                    {
                        path: 'author',
                        model: 'Author',
                        select: '_id name ref_url ref_img'
                    },
                    {
                        path: 'tags', 
                        model: 'Tag',
                        select: '_id name'
                    },
                    {
                        path: 'creator',
                        model: 'User',
                        select: '_id name'
                    }
                ]
            }) || [];
        } catch (error) {
            return next(new HttpError(error));
        }
        if (schemaSearchResults.length > 0) {
            for (el of schemaSearchResults) {
                searchResults = searchResults.concat(el.quotes);
            }
        }
    }

    try {
        if (!searchResults.length) {
            return next(new HttpError("No quotes found", 404))
        } else {
            return res.json({ header: `Results of search term: “${req.params.term.toString()}”`, quotes: (searchResults.length ? searchResults.map(quote => quote.toObject({ getters: true })) : []) })
        };
    } catch (error) {
        return next(new HttpError(error));
    }

};


const constructQuote = async (req, res, next) => {
    currentUserId = req.userData.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(
            errors.errors.map(
                (e, i) => `${i === 0 ? "Validation error(s): " : " "}(${i + 1}) ${e.msg} for '${e.param}'`
            ), 422
        ))
    }

    let { text, author } = req.body;
    let tags = [...new Set(req.body.tags.toString().split(',').map(e => e.trim().toLowerCase()))].sort() || [];
    let isPublic = req.body.isPublic;

    if (author.trim().length <= 0) { author = "Anonymous"; }
    if (tags.length === 1 && String(tags[0]).trim().length <= 0) { tags = []; }

    let authorInfo
    if (author && author.length > 0) {
        try {
            authorInfo = await getWiki(author);
        } catch (error) {
            return next(new HttpError(error));
        }
    }

    if (authorInfo) {
        author = authorInfo.name
    }

    let authorExisting;
    try {
        authorExisting = await Author.findOne({ name: author })
    } catch (error) {
        return next(new HttpError(error));
    };
    if (!authorExisting) {
        const authorCreated = new Author({
            name: author || "Anonymous",
            quotes: []
        });

        if (authorInfo) {
            authorCreated.name = authorInfo.name;
            if (authorCreated.name !== "Anonymous") {
                authorCreated.ref_url = authorInfo.url;
                authorCreated.ref_img = authorInfo.img;
            }
        }

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
            select: '_id name ref_url ref_img quotes'
        }, {
            path: 'tags',
            model: 'Tag',
            select: '_id name quotes'
        }, {
            path: 'creator',
            model: 'User',
            select: '_id name'
        }]) || ((req.params.qid === undefined && !textExisting) && new Quote({
            text,
            tags: [],
            author: authorExisting._id,
            creator: currentUserId
        }));
    } catch (error) {
        return next(new HttpError(error));
    };

    let user;
    try {
        user = await User.findById(currentUserId)
    } catch (error) {
        return next(new HttpError(error));
    }

    let adminIds;
    try {
        adminIds = await getAdminIds()
    } catch (error) {
        return next(new HttpError(error));
    }


    if (!user) {
        return next(new HttpError("Could not find user with the id provided"));
    } else if (req.params.qid !== undefined &&
        ![quoteConstructed.creator._id.toString(), ...adminIds].includes(currentUserId.toString())) {
        return next(new HttpError("Unauthorized to construct this quote", 401));
    }

    try {
        if (req.params.qid === undefined) {
            user.quotes.push(quoteConstructed);
        }
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
        quoteConstructed.isPublic = eval(isPublic)
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
    currentUserId = req.userData.userId;
    const quoteId = req.params.qid
    let quote, author, tags, creator;


    try {
        quote = await Quote.findById(quoteId)/*.populate('creator').populate('author').populate('tags')*/;
    } catch (error) {
        return next(new HttpError(error));
    }

    if (!quote) {
        return next(new HttpError("Could not find quote with the id provided", 404));
    }

    try {
        [author, tags, creator] = [quote.author, quote.tags, quote.creator];
    } catch (error) {
        return next(new HttpError(error));
    }


    let adminIds;
    try {
        adminIds = await getAdminIds()
    } catch (error) {
        return next(new HttpError(error));
    }
    if (creator && ![creator._id.toString(), ...adminIds].includes(currentUserId.toString())) {
        return next(new HttpError("Unauthorized to Delete", 401));
    }

    try {
        await Quote.findByIdAndDelete(quoteId);
    } catch (error) {
        return next(new HttpError(error));
    }


    try {
        await User.updateOne(
            { _id: currentUserId.toString() },
            { $pull: { 'quotes': quoteId } },
            { returnNewDocument: true, returnOriginal: false }
        );
    } catch (error) {
        return next(new HttpError(error));
    }

    try {
        await Author.updateOne(
            { _id: mongoose.Types.ObjectId(author.toString()) },
            { $pull: { 'quotes': quoteId } },
            { returnNewDocument: true, returnOriginal: false }
        );
    } catch (error) {
        return next(new HttpError(error));
    }

    for (tag of tags) {
        try {
            await Tag.updateOne(
                { _id: mongoose.Types.ObjectId(tag.toString()) },
                { $pull: { 'quotes': quoteId } },
                { returnNewDocument: true, returnOriginal: false }
            );
        } catch (error) {
            return next(new HttpError(error));
        }
    }


    return res.status(200).json({ message: `deleted quote “${quote.text}” (id: ${quoteId}) ` });

};


module.exports = {
    getAllQuotes,
    getQuoteById,
    getQuotesByUserId,
    getQuotesByTagId,
    getQuotesByAuthorId,
    getQuotesBySearchTerm,
    constructQuote,
    deleteQuote
};
