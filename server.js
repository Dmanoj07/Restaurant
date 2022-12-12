/*************************************************************************************
* WEB322 - 2227 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Manoj Dhami
* Student ID    : 121613202
* Course/Section: WEB322/NEE
*
**************************************************************************************/


const express = require("express");
const exphbs = require('express-handlebars');
// const meals = require("./models/mealkit-db");
const mongoose = require("mongoose");
// Set up dotenv
const dotenv = require("dotenv");
const session = require("express-session");
const fileUpload = require("express-fileupload");

dotenv.config({ path: "./config/keys.env" });

//set up handlebarsnode 
const app = express();
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

var hbs = exphbs.create({});
hbs.handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a === b) { return options.fn(this); }
    return options.inverse(this);
});

// Set up body-parser
app.use(express.urlencoded({ extended: true }));

// Set up express-upload
app.use(fileUpload());

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // res.locals.user is a global handlebars variable.
    // This means that every single handlebars file can access this variable.
    res.locals.user = req.session.user;
    // res.locals.isclerk = res.session.isclerk;
    next();
});

//connect to the mongoDb
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("connected to mongoDb.");
    })
    .catch(err => {
        console.log(`There was a problem connected to mongoDb....${err}`);
    });


// Add your routes here
// e.g. app.get() { ... }
//middleware for css
app.use(express.static("assets"));
app.use('/js', express.static(__dirname + "/assets/js/"));


//Set up Controllers
const generalController = require("./controllers/generalController");
const userController = require("./controllers/userController");
const clerkController = require("./controllers/clerk");
const customerController = require("./controllers/customer");
const loadDataController = require("./controllers/load-data");
const mealController = require("./controllers/mealController");

app.use("/", generalController);
app.use("/user/", userController);
app.use("/customer/", customerController);
app.use("/clerk/", clerkController);
app.use("/load-data/", loadDataController);
app.use("/meals/", mealController);




// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);
