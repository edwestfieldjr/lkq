const wiki = require('wikijs').default;

async function getWiki(terms) {
    try {    
        if (terms && terms.length > 0) {
            const result = async (terms) => await wiki().search(terms, 1, true)
                .then(async data => data && await wiki().page(data ? data.results[0].title : null)
                    .then(async (page, obj={}) => 
                        {
                            if (page) {obj.name = await data.results[0].title;
                            obj.img = await page.mainImage()
                            obj.url = await page.url()}
                            return await obj;    
                        }
                    )
                )
            ;

            if (result) {
                return await result(terms)
            } else { return 0; }
        } else {
            return 0;
        }
    } catch (e) { 
        return null
    }
}

module.exports = getWiki;
