# LKQ: Your Favorite Quotes
#### CS50x Final Project 
### ©2022 **Edward Francis Westfield Jr.**
#### East Lansing, Michigan &#127482;&#127480; USA<br/>ed.westfield.jr@gmail.com • [edwestfieldjr.com](https://www.edwestfieldjr.com/)
---
#### Video Demo:  <URL HERE>
---
#### Live Test Deployment:  https://lkq-fe-cs50x-2022.web.app/
#### GitHub Repository:  https://github.com/edwestfieldjr/lkq
---
## Description 

My CS50x final project, entitled **“[LKQ: Your Favorite Quotes](https://lkq-fe-cs50x-2022.web.app/)”**, is a full-stack **M**ongo-**E**xpress-**R**eact-**N**ode ("**MERN**") web application for the saving and display of one’s favorite quotations and sayings from notable figures or anyone. 

In this app, a user can sign up for an account (with a username, email address, and encrypted password). Once logged-in, users can create new quotation articles by inputting the following:

- A quotation or saying
- The author/person attributed with the quote
- Keyword/keyphrase tags (comma-separated) to help categorize, sort and display the quotes
- a 'checkbox' option to display this quotation article publicly id checked, or privately if unchecked.

The application then saves the quote, the author’s name, and the tags (as comma-separated keyword/keyphrases), to the MongoDB database. In addition, the 'getWiki' utility (which employs the [wikijs](https://www.npmjs.com/package/wikijs) Node package) retrieves links to the author's public-domain Wikipedia page and photo (if available). This is used when displaying the quote on screen.

The Mongoose schemas for the quote, author, tags, and the user, are then saved to the database in separate but related collections, so that the API can serve and sort the content based upon each collection. Thus, the web app allows the quotes to be grouped and sorted by the author and the keyword tags that are saved with each quote. In this version, you simply click on either the authors name, the users name, or one of the tag buttons, and the API will serve quote articles relevant to that data. There is also a simple keyword search feature that returns quote results with an exact partial string match of either authors, quotes or tags (whatever matches that text). 

The app has full "CRUD" (Create, Read, Update, and Delete) functionality with the user having the ability to edit and delete the quotes they have posted, and can also select whether their quote articles are publicly visible to anyone with access to the site, or just privately viewable only to them while logged in. There is one administrator account with has access to the entire app (currently, this is set in the environment variables upon deployment).

The quote is displayed with the author's information (name, photo, Wikipedia  link), the keys tags, the user who posted it, and a background photo. The UX/UI look and feel is made to resemble inspirational posters and greeting cards. If no Wikipedia  info is available, a default anonymous link and avatar are saved. If no author is entered at all, it defaults to "Anonymous". The [unsplash.com](https://unsplash.com/) stock photo random photo search feature also provides background image using the quote's tags as additional search terms for finding an appropriate/relevant image (serving up a different background image on each reload). 
 
“LKQ” stands for “Lesser Known Quotes”, a working title for this project. 

###  How does this app run/execute?

A full-stack MERN application is essentially two Node.js servers running side-by-side, with the frontend service the React application, and the backend API running Express and communicating with the Mongo database server. The React frontend sends requests and receives data from the backend to construct the web content the user ultimately sees.  

---
## Specifications

This project was written in the following languages: 

- JavaScript
- HTML
- CSS

Software, Packages, Dependencies & API's Installed, Employed or Deployed in this App (*selected list*)

- [Node.js](https://nodejs.org/) 
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [React](https://express.com/)
- [create-react-app](https://create-react-app.dev/)
- [bCrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [wikijs](https://www.npmjs.com/package/wikijs)
- [unsplash.com](https://unsplash.com/) (non-API random image service)

### Other Features
- Form field authentication
- Mobile-optimized view

### Live Test Deployment
https://lkq-fe-cs50x-2022.web.app/  
Hosted on:
- [Google Firebase](https://firebase.google.com/) (frontend)
- [Heroku](https://dashboard.heroku.com/) (backend)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (database)

### Environment  variables
If pulling from [GitHub](https://github.com/edwestfieldjr/lkq) for separate deployment, each directory requires an `.env` file containing the following. 
- frontend-lkq/`
    - `REACT_APP_BACKEND_API_ADDRESS`
- backend-lkq/
    - `DB_URL` (MongoDB URL)
    - `SECRET` (for use with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
    - `ADMIN_EMAIL_ADDR` (currently only way to set the admin user in the DB)
#### 
---
## Takeaways

I have learned that building a modern full-stack application one’s own can seem daunting, but it is achievable. It is understandable, and perhaps advisable, that developers and engineers would focus their careers on frontend, backend, database, or some other specific aspect of web and software development. Still, knowing how the whole thing is made start to finish in an important learning experience.  

### Possible improvements:

- Better UI/UX on the frontend allowing users to customize their viewing experience
- Better search functionality to find specific content (autocomplete, multiple search terms, spell-checker, natural language , etc.)
- Improve or overhaul the getWiki function so that it is more accurate in retrieving an author’s biographical data
- Better user functionality (permissions, user management, authentication/OAuth, messaging, ‘social-media’ functionality, etc.) 
- Separate git repositories for frontend and backend since a single git caused minor bugs in deployment (The fixed did work, but this may be a case where breaking the project up into two repositories is the simpler solution)
- Better encryption and security (see below)

---
### Security 

- **Do not store any sensitive or private data or text on the live site.**
- All 'GET' requests the backend mongo/express API are open and not secure; quote articles are still publicly accessible directly from the API (the "Public" checkbox on the form only designates whether it publishes to the frontend-- working on a security patch to address this)
- An email address is needed to log in, but it is not authenticated. You do not need to use a real email address to use the system, so long as it conforms to an email address format. 
- User accounts cannot be deleted. If you want your user information scrubbed from the database, please email met a ed.westfield.jr@gmail.com
- More curated and better assortment of background photos, either by 
- the deployed live site and backend API will be taken offline sometime in late 2022/early 2023.

---

## Thank you.
©2022 [**Edward Francis Westfield Jr.**](https://www.edwestfieldjr.com/) ([Standard MIT License](https://opensource.org/licenses/MIT))

---
`date submitted: 2022-08-13` 