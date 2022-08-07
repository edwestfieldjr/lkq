# LKQ: Your Favorite Quotes
#### CS50x Final Project, ©2022 
#### **Edward Francis Westfield Jr.**<br/>East Lansing, MI &#127482;&#127480; USA<br/>ed.westfield.jr@gmail.com
---
#### Video Demo:  <URL HERE>
#### Live Test Site:  <URL HERE>
---
## Description: 


### What id this software? What does it do? 

My CS50x final project is a full-stack Mongo-Expres-React-Node("MERN") web application to save and display favorite and inspiring quotations from notable figures. 

### What features will it have? 

A user can sign up for an account, and once logged-in they create a new quotation input the following:

- Quotation or saying
- Author/person attributed with the quote
- Keyword "categories/tags" to help sort and display the quotes

The application saves the quote, author, and tags, to the MongoDB. in addition, the 'getWiki' utility (which employs the https://www.npmjs.com/package/wikijs package) retrieves links to the author's wikipedia page and photo. This is used when displaying the quote on screen.

The quote is displayed with the author info (name, photo, wikipedia link), the keys tags, the user who posted, and a background photo. The UX/UI look and feel is to resemble inspirational cards and posters. 

the mongoose schemas also allow the quotes to be groups and sorted by the author and the keyword tags that ar saved with each quote. the unspalsh.coms public domain photo api also provide a difference the backgrounf image and uses the tag namen in it keyword search for the background image, so it It changes 

The user has the ability to edit and delete the quotes they have posted, and also whether they are publicly to anyone with access to the site, or just privately acceble only to them (There is one administrator account that has access to the while site.)

### How (and Why) did I learn to make this?

After sitting through the CS50x course earluer this yeet, I knew that I wanted to build a full stack website from the ground up. MERN full-stacks developer skills seem to be very popular and currenly in-demand. so researched and studied how to do it. 

This meant brushing up on both “vanilla” JavaScript as wella s the 'jsx" sytanx of React. I learned more about MongoDB, which unlike SQL is non-relational, and thus, is more scalable and malleable database, and I learned more about Mongoose, the JavaScript library that creates an relational-like connection between MongoDB and the node backend. 

I studied how to build and Express.js server and how it intereacts with thea react front end in how to route and authenticate information,  I also brushed up on my html and css.


If working with one or two classmates, who will do what?
In the world of software, most everything takes longer to implement than you expect. And so it’s not uncommon to accomplish less in a fixed amount of time than you hope. What might you consider to be a good outcome for your project? A better outcome? The best outcome?

The implementation is fairly simple, to keep the project scope in check. I wanted to make a project like this to expand my knowledge of Node JS and of techniques like buffer piping from database to client, role based authentications, etc.

###  How is this  it be executed?

A full-stack MERN application is essentially two Node.js servers running side-by-side, with the backend API running Express.js and communicating with the database server. The "frontend" sends requests and receives the from the backend and constructs the web content as requested by the user 

#### Software Packages, Dependencies & API's Installed, Employed or Deployed in this App (selected list):

- Node.js 
- Express.js
- React
- MongoDB
- Mongoose
- create-react-app
- wikijs
- bCrypt
- unsplash.com (for backgruong imafge )

#### Languages:

- JavaScript/JSX
- HTML/CSS
Sofware Packages Installed or Deplyed used:

- Node.js 
- Express.js
- React
- MongoDB
- sqlite3
- ejs
- other libraries or packages via npm

### What I have learend... 

a modern full stack appllcation is a daunting task, but acheivavle with proper planning and. It is understandavble that people want to fous or special is finerent, backend or db, but knowing how the whole pie works is an important asset to have.  

#### Possible improvements:

- Have an interface for more interactivity between users and the ability to set more permissions as needed.abs
- searchbar functionality to find specific content (quotes, authors, etc)
- Better UI/ON the front end: make it look less like a traditional web interface and more like a 'e-card' 
- Have a way for teacher to upload videos to explain the assignment
- Notificaitons to email about new homeworks or submissions

## How to launch / use 

### pull from github
### sign up  or browse the heroku