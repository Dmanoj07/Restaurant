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


const path = require("path");
const express = require("express");
const exphbs = require('express-handlebars');
const meals = require("./models/mealkit-db");

// Set up dotenv
require("dotenv").config();

//set up handlebars
const app = express();
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout:"main"
}));
app.set('view engine', '.hbs');

// Set up body-parser
app.use(express.urlencoded({ extended: false }));

// Add your routes here
// e.g. app.get() { ... }
//middleware for css
app.use(express.static("assets"));

// old route
app.get("/", (req,res) =>{
   
    res.render("general/index.hbs", {
        mealList: meals.getTopMealkits(),
        title: "Home Page"
    });
});
app.get("/onthemenus", (req,res) =>{
    res.render("general/onthemenus",
    {
        mealList: meals.getMealkitsByCategory(),
        title: "Menu Page"
    });
});
app.get("/signup", (req,res) =>{
    res.render("general/signup");
});
app.get("/login", (req,res) =>{
    res.render("general/login");
});




//validation for registration and login
var regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
var emailregexerp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
app.post("/welcome", (req, res) => {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string" || firstName.trim().length === 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.firstName = "Enter a first name";
    }
    else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters long.";
    }

    if (typeof lastName !== "string" || lastName.trim().length === 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.lastName = "Enter a last name";
    }
    else if (typeof lastName !== "string" || lastName.trim().length <= 2) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.lastName = "The last name should be at least 2 characters long.";
    }

    if (typeof email !== "string" || email.trim().length === 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.email = "Enter email address";
    }
    else if (typeof email !== "string" || !emailregexerp.test(email)) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.email = "Enter Valid email address";
    }

    if ( password.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.password = "Enter a password";
    }
    else if (password.trim().length < 8 ) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.password = "The password should be at least 8 characters long.";
    }

    else if (!regularExpression.test(password) ) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.password = "password should contain atleast one number, one uppercase letter, one lowercase letter and one special character";
    }

    if (passedValidation) {
        validationMessages = "Success, validation passed and email has been sent.";
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email, //email
            from: "manoj123dhami@gmail.com",
            subject: "Contact Us Form Submission",
            html:
                `Thank You ${firstName} ${lastName} For Registration :) <br>
                 - Manoj Dhami <br>
                 - BreakFast.com<br>
                `
        };

        sgMail.send(msg)
            .then(() => {
                res.render("general/welcome", {
                    title: "Sign UP",
                    values: req.body,
                    validationMessages,
                });
                //res.send("Success, validation passed and email has been sent.");
            })
            .catch(err => {
                console.log(err);

                res.render("general/welcome", {
                    title: "Welcome",
                    values: req.body,
                    validationMessages
                });
            });

    }
    else {
        res.render("general/signup", {
            title: "Sign UP",
            values: req.body,
            validationMessages
        });
    }

});

app.post("/index", (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof email !== "string" || email.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.email = "Enter email address";
    }
    else if (typeof email !== "string" || !emailregexerp.test(email)) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.email = "Enter Valid email address";
    }

    if ( password.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.password = "You must set a password";
    }
    else if (password.trim().length < 8 ) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.password = "The password should be at least 8 characters long.";
    }

    else if (!regularExpression.test(password) ) {
        passedValidation = false;
        validationMessages.password = "password should contain atleast one number, one uppercase letter, one lowercase letter and one special character";
    }


    if (passedValidation) {
        res.render("general/", {
            title: "Login",
            values: req.body,
            validationMessages
        });

    }
    else {
        res.render("general/login", {
            title: "Login",
            values: req.body,
            validationMessages
        });
    }

});





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
