# LKQ: Your Favorite Quotes
#### A [CS50x](https://cs50.harvard.edu/x/) Final Project 
### ©2022 **Edward Francis Westfield Jr.**
#### East Lansing, Michigan &#127482;&#127480; USA<br/>ed.westfield.jr@gmail.com • [edwestfieldjr.com](https://www.edwestfieldjr.com/)
---
#### Video Demo:  https://youtu.be/ZnBBhf7u7w0
---
#### Live Test Deployment:  https://lkq-fe-cs50x-2022.web.app/
#### GitHub Repository:  https://github.com/edwestfieldjr/lkq
---
## Description 

My CS50x final project, entitled **“[LKQ: Your Favorite Quotes](https://lkq-fe-cs50x-2022.web.app/)”**, is a full-stack [**M**ongo](https://www.mongodb.com/)-[**E**xpress](https://expressjs.com/)-[**R**eact](https://reactjs.org/)-[**N**ode](https://nodejs.org/)  ("**MERN**") web application for the saving and display of one’s favorite quotations and sayings from notable figures or anyone. 

In this app, a user can sign up for an account (with a username, email address, and encrypted password). Once logged-in, users can create new quotation articles by inputting the following:

- A quotation, proverb or saying
- The author/person attributed with the quote
- Keyword/keyphrase tags (comma-separated) to help categorize, sort and display the quotes
- a checkbox option to display this quotation article publicly if checked, or privately only when logged in if unchecked.

The application then saves the quote, the author’s name, and the tags (in an array), to the MongoDB database. In addition, the 'getWiki/[wikijs](https://www.npmjs.com/package/wikijs utility retrieves links to the author's public-domain Wikipedia page and photo (if available), which then gets displayed with the quote.

The [Mongoose](https://mongoosejs.com/)-based models for the quote, author, tags, and the user collections are then saved to the database in separate but related collections, so that the API can serve and sort the content based upon each collection, allowing the quotes to be grouped and sorted by the author and the keyword tags that are saved with each quote. In this version, you simply click on either the authors name, the users name, or one of the tag buttons, and the API will serve the page of quote articles relevant to that data. There is also a simple keyword search feature that returns quote results with an exact partial string match of either the authors, quotes, or tags (whichever data matches the particular substring). 

The app has full ["CRUD"](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) functionality with the user having the ability to edit and delete the quotes they have posted, and can also select whether their quote articles are publicly visible to anyone with access to the site, or just privately viewable only to them while logged in. There is one administrator account with has access to the entire app (currently, this is set in the environment variables upon deployment).

The quote is displayed with the author's information (name, photo, Wikipedia  link), the keys tags, the user who posted it, and a background photo. The UX/UI look-and-feel is made to resemble inspirational posters and greeting cards. If no Wikipedia  info is available, a default anonymous link and avatar are saved. If no author is entered at all, it defaults to "Anonymous". The [unsplash.com](https://unsplash.com/) stock photo random photo search feature also provides background image using the quote's tags as additional search terms for finding an appropriate/relevant image (serving up a different background image on each reload). 
 
“LKQ” stands for “Lesser-Known Quotes”, a working title for this project. 

###  How does this app run/execute?

This full-stack MERN application is essentially two Node.js servers running side-by-side, with the frontend serving the [React](https://express.com/) build, and the backend API running [Express](https://expressjs.com/) and communicating with the Mongo database server. The React frontend sends requests and receives data from the backend to construct the web content the user ultimately sees. It can be deployed on any system that supports [Node.js](https://nodejs.org/) 

---
## Specifications

This project was written in the following languages: 

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

Software, Packages, Dependencies & API's Installed, Employed or Deployed in this App (*selected list*)

- [Node.js](https://nodejs.org/) 
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [React](https://reactjs.org/)
- [create-react-app](https://create-react-app.dev/)
- [bCrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [wikijs](https://www.npmjs.com/package/wikijs)
- [unsplash.com](https://unsplash.com/) (non-API random image service)

### Other Features
- Form field authentication
- Mobile-optimized view

### Live Test Deployment
You can visit and use this app at the test site: 

https://lkq-fe-cs50x-2022.web.app/  

The test site is hosted on the following services:
- [Google Firebase](https://firebase.google.com/) (frontend)
- [Heroku](https://dashboard.heroku.com/) (backend)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (database)

### Codebase Structure
The code is split into two separate node.js app directories:
- `frontend-lkq/` containing the react application and html/css elements
- `backend-lkq/` the express/mongoose api framework application  

The app is conained in a single GitHub repo.

### Environment  variables
If pulling from [GitHub](https://github.com/edwestfieldjr/lkq) for separate deployment, each directory requires an `.env` file containing the following. 
- frontend-lkq/
    - `REACT_APP_BACKEND_API_ADDRESS`
- backend-lkq/
    - `DB_URL` (MongoDB URL)
    - `SECRET` (for use with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
    - `ADMIN_EMAIL_ADDR` (currently only way to set the admin user in the DB)
#### 
---
## Takeaways

***I have learned*** that building a modern full-stack application one’s own can seem daunting, but it is achievable, and knowing how to make a full-stack application start to finish in an important learning experience and a valuable asset. 

### Possible improvements:

- Better search functionality to find specific content (multiple search terms, natural language searches, autocomplete, spell-checker, etc.)
- Improve or overhaul the getWiki function so that it is more accurate in retrieving an author’s biographical data
- Better user functionality (permissions, user management, authentication/OAuth, messaging, ‘social-media’ functionality, etc.) 
- Periodic database purging of author and tag records no longer associated with any quote article. 
- Improve upon UI/UX and CSS styling, possibly allowing users to customize their viewing experience; specifically, adding 'button' style input to the tags' input form.
- Separate git repositories for frontend and backend servers. 
    - Single git caused Heroku deployment failure, since Heroku requires package.json must be in the top level directory. This Issue was fixed by employing [subdir-heroku-buildpack](https://github.com/timanovsky/subdir-heroku-buildpack) 
    - Breaking the project up into two repositories would simplify workflows and  reduce the amounts of unnecessary commits.
- Better encryption and security (see below)

---
### Security Advisories

- **Do not store any sensitive or private data or text on the live site.**
- All 'GET' requests the backend mongo/express API are open and not secure; quote articles are still publicly accessible directly from the API (the "Public" checkbox on the form only designates whether it publishes to the frontend-- working on a security patch to address this)
- Your unique username will also also publicly accessible on the backend API, however email addresses and encrypted passwords are not accessible in that way. 
- A unique email address is needed to sign-up and to log in, but it is not authenticated. You do not need to use a real email address to use the system, so long as it conforms to an email address format. 
- User accounts cannot be deleted. If you want your account and user information deleted from the from the database, please email me at: ed.westfield.jr@gmail.com
- ***The deployed live site, backend API, and the database will be taken offline some time in late 2022/early 2023.*** 

---

## Thank you!
©2022 [**Edward Francis Westfield Jr.**](https://www.edwestfieldjr.com/) ([Standard MIT License](https://opensource.org/licenses/MIT))

---
`date submitted: 2022-08-15` 