const express = require("express");
const { model } = require("mongoose");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const router = express.Router();

//regex
var regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
var emailregexerp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//(Get)User registration Page

router.get("/signup", (req, res) => {
    res.render("user/signup");
});


//(Get)User registration Page

router.post("/signup", (req, res) => {

    const user = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    const { firstName, lastName, email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string" || firstName.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.firstName = "Enter a first name";
    }
    else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters long.";
    }

    if (typeof lastName !== "string" || lastName.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.lastName = "Enter a last name";
    }
    else if (typeof lastName !== "string" || lastName.trim().length <= 2) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.lastName = "The last name should be at least 2 characters long.";
    }

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

    if (password.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.password = "Enter a password";
    }
    else if (password.trim().length < 8) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.password = "The password should be at least 8 characters long.";
    }

    else if (!regularExpression.test(password)) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.password = "password should contain atleast one number, one uppercase letter, one lowercase letter and one special character";
    }


    if (passedValidation) {

        user.save()
            .then(userSaved => {
                console.log(`User ${userSaved.firstName} has been added to the database.`);

                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                var msg = {
                    to: userSaved.email, //email
                    from: "manoj123dhami@gmail.com",
                    subject: "Sign Up Form Submission",
                    html:
                        `Thank You ${firstName} ${lastName} For Registration :) <br>
                                    - Manoj Dhami <br>
                                    - BreakFast.com<br>
                                    console.log("pass3");    `
                };

                sgMail.send(msg)
                    .catch(err => {
                        console.log(err);

                        res.render("general/welcome", {
                            title: "Welcome",
                            values: req.body,
                            validationMessages
                        });
                    });
                res.redirect("/user/login");
            })
            .catch(err => {
                if (err.message.indexOf("11000") === -1) {
                    validationMessages.errorMsg = "Error in connecting to the database.";
                } else {
                    validationMessages.errorMsg = "Email already registered.";
                }
                res.render("user/signup", {
                    title: "Signup",
                    values: req.body,
                    validationMessages
                });
            });
    }
    else {
        // validation error
        res.render("user/signup", {
            title: "Sign UP",
            values: req.body,
            validationMessages
        });
    }
});


router.get("/login", (req, res) => {
    if (req.session.user) {
        if (req.session.user.isclerk) {
            res.redirect('/clerk/list-mealkits');
            return;
        } else {
            res.redirect('/customer/cart');
            return;
        }
    } else {
        res.render("user/login");
    }

});

router.post("/login", (req, res) => {

    const { email, password, radOpt } = req.body;

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

    if (password.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.password = "You must set a password";
    }
    else if (password.trim().length < 8) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.password = "The password should be at least 8 characters long.";
    }

    else if (!regularExpression.test(password)) {
        passedValidation = false;
        validationMessages.password = "password should contain atleast one number, one uppercase letter, one lowercase letter and one special character";
    }


    if (passedValidation) {
        // TODO: Validate the form information

        // Search MongoDB for the matching document (based on email address).
        userModel.findOne({
            email: req.body.email
        })
            .then(user => {
                // Completed the search.
                if (user) {
                    // Found the user document.
                    // Compare the password submitted to the password in the document.
                    bcrypt.compare(req.body.password, user.password)
                        .then(isMatched => {
                            // Done comparing passwords.

                            if (isMatched) {
                                // Passwords match.
                                // Create a new session and store the user object.
                                req.session.user = user;
                                req.session.user.isclerk = (req.body.radOpt === "clerk") ? true : false;
                                // condiditionally render
                                if (req.session.user.isclerk) {
                                    res.redirect('/clerk/list-mealkits');
                                } else {
                                    res.redirect('/customer/cart')
                                }
                            }
                            else {
                                // Passwords are different.
                                validationMessages.errorMsg = "Incorrect password provided.";
                                res.render("user/login", {
                                    title: "Login",
                                    values: req.body,
                                    validationMessages
                                });
                            }
                        })
                }
                else {
                    // User was not found.
                    validationMessages.errorMsg = "Incorrect email provided.";
                    res.render("user/login", {
                        title: "Login",
                        values: req.body,
                        validationMessages
                    });
                }
            })
            .catch(err => {
                // Couldn't query the database.
                validationMessages.errorMsg = "Error in connecting to the database.";
                res.render("user/login", {
                    title: "Login",
                    values: req.body,
                    validationMessages
                });
            });

    }
    else {
        res.render("user/login", {
            title: "Login",
            values: req.body,
            validationMessages
        });
    }

});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    res.redirect("/user/login");
});

module.exports = router;
