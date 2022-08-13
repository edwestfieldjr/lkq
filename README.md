# LKQ: Your Favorite Quotes
#### CS50x Final Project  
#### ©2022 **Edward Francis Westfield Jr.**<br/>East Lansing, Michigan &#127482;&#127480; USA<br/>ed.westfield.jr@gmail.com
---
#### Video Demo:  <URL HERE>
#### Live Test Deployment:  https://lkq-fe-cs50x-2022.web.app/
---
## Description: 


### What is this software? What does it do? 

My CS50x final project is a full-stack **M**ongo-**E**xpres-**R**eact-**N**ode ("**MERN**") web application to save and display favorite and inspiring quotations from notable figures. 

### What features does it have? 

In this App A user can sign up for an account with an name, email, address and password (which gets encrypted), and once logged-in they create a new quotation input the following:

- Quotation or saying
- Author/person attributed with the quote
- Keyword "categories/tags" to help sort and display the quotes

The application saves the quote, the author’s name, and tags, to the MongoDB. in addition, the 'getWiki' utility (which employs the [wikijs](https://www.npmjs.com/package/wikijs) Node package) retrieves links to the author's public-domain Wikipedia page and photo (if available, otherwise an a default anonymous avatar and avatar are saved). This is used when displaying the quote on screen.

The quote is displayed with the author info (name, photo, wikipedia link), the keys tags, the user who posted, and a background photo. The UX/UI look and feel is made to resemble inspirational posters and greeting cards. 

the mongoose schemas for the quote, author, tags, the user, save the info in separate collections and the api has the ability to serve and sort the content based upon each collection. also allow the quotes to be groups and sorted by the author and the keyword tags that ar saved with each quote. the [unspalsh.com](https://unsplash.com/) royalty-free stock photo API also provide background image using the quotes tags as search terms for finding an appropriate/relavant image. 

The app has full "CRUD" (Create, Read, Update, and Delete) functionality user has the ability to edit and delete the quotes they have posted, and also whether they are publicly visible to anyone with access to the site, or just privately a viewable only to them (There is one administrator account that has access to the while site.)

### How (and Why) did I learn to make this?

After taking all the CS50x classes, and already building a Python-Jinja-SQL full-stack ap earlier this year, I wanted to switch to the other end of the spectrum and build a MERN full-stack website, which seem to be popular and currently in-demand. So researched further and taught myself how to do it. 

This meant brushing up on both “vanilla” JavaScript as well as learning the '.jsx" syntax of React. I studied how to build an Express.js server, how it interacts with the react front-end in routing and authenticating information. I brushed up on my html and css. For the database end, I learned more about MongoDB, which unlike SQL is non-relational, and thus, is more scalable and malleable database. I learned about Mongoose, the JavaScript library that creates an relational-like connection between MongoDB and the node backend, and I learned more about the difference between one-to-one and one-to-many relationships, and how to set them up in proper database schemas. 

###  How does this app run/execute?

A full-stack MERN application is essentially two Node.js servers running side-by-side, with the backend API running Express.js and communicating with the database server. The "frontend" sends requests and receives the from the backend and constructs the web content as inputted and requested by the user.  

## Specifications
### Software Packages, 
#### Packages Dependencies & API's Installed, Employed or Deployed in this App (*selected list*):

- Node.js 
- Express.js
- React
- MongoDB
- Mongoose
- create-react-app
- wikijs
- bCrypt
- [unspalsh.com](https://unsplash.com/) API 

#### Languages:

- JavaScript
- HTML
- CSS

### What else I have learned / The Takeaways ... 

Aside from the technical knowledge I acquired in building this web application,   

#### Division of Labor/Specialization 
(Building a modern full stack application by oneself is a daunting task, but achievable with proper planning and know-how. It is understandable and perhaps  advisable that developers and engineers would want to focus on frontend, backend, database, or some other aspect of web and software development. Still, knowing how the whole thing is made start to finish in an important asset to have.  

#### Possible improvements:

- Have an interface for more interactivity between users and the ability to set more permissions as needed.abs
- searchbar functionality to find specific content (quotes, authors, etc)
- Better UI/ON the front end: make it look less like a traditional web interface and more like a 'e-card' 
- Have a way for teacher to upload videos to explain the assignment
- Notificaitons to email about new homeworks or submissions
- Better API secuity

## Securiy Notices

- with the execption of stored passwords and user create/update/delete permissions, backend api is open and otherwise not secure. 
- an email adress is needded