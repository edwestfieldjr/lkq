const wiki = require('wikijs').default;

async function getWiki(terms) {
    
    const result = async (terms) => await wiki().search(terms, 1, true)
        .then(async data => await wiki().page(data.results[0].title)
            .then(async (page, obj={}) => {
                obj.name = await data.results[0].title;
                obj.img = await page.mainImage()
                obj.url = await page.url()
                return await obj;    
            })
        )

    // return await "result(terms).obj"
    return await result(terms)
}

module.exports = getWiki;
