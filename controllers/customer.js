const express = require("express");
const router = express.Router();
const meals = require("../models/mealkit-db");
const db = meals.mealModel;
const userDb = require("../models/userModel");
const sgMail = require("@sendgrid/mail");


router.get('/cart', (req, res) => {
  if (req.session.user) {
    if (!req.session.user.isclerk) {
      // fetch the list of items
      var userCart = [];
      userDb.find({ _id: req.session.user._id }, async (err, docs) => {
        // console.log(docs);
        userCart = docs[0].userCart;

        if (userCart.length === 0) {
          res.render("general/wcCustomer.hbs", {
            hasDat: false,
            itmsnumCart: 0
          });
        } else {
          let myList = [];
          const dumLenx = userCart.length;
          let totalCost = 0;
          for (let indxx = 0; indxx < dumLenx; indxx++) {
            const elem = userCart[indxx];
            const dummy = await db.find({ _id: elem.item }, (err, docs) => {
              if (docs.length === 0) {
                return;
              }
              const dumtp = docs[0].price * elem.count;
              let thisDat = {
                "prodId": docs[0]._id,
                "title": docs[0].title,
                "price": docs[0].price,
                "quantity": elem.count,
                "imageUrl": docs[0].imageUrl,
                "totalPrice": dumtp.toFixed(2)
              }
              totalCost += docs[0].price * elem.count;
              myList.push(thisDat);
            }).clone().lean();
          }
          // purposed delay to avoid errors
          setTimeout(() => {
            res.render("general/wcCustomer.hbs", {
              hasDat: (myList.length !== 0),
              itmsnumCart: myList.length,
              totalOverallCost: totalCost.toFixed(2),
              docs: myList
            });
          }, 1000);

        }

      }).clone().lean();



    } else {
      res.redirect("/clerk/list-mealkits");
    }
  } else {
    res.redirect("/user/login");
  }

});

router.get('/updateCart/:id/:newVal', (req, res) => {
  if (req.session.user) {
    if (!req.session.user.isclerk) {


      //update db
      userDb.updateOne({ _id: req.session.user._id, "userCart.item": req.params.id.substring(1) }, {
        "$set": {
          "userCart.$.count": req.params.newVal.substring(1)
        }
      })
        .then(() => {
          // purposed delay so that database is updated in the backend.
          setTimeout(() => {
            res.redirect("/customer/cart");
          }, 500);

        });

    } else {
      res.redirect("/clerk/list-mealkits");
    }
  } else {
    res.redirect("/user/login");
  }

});

router.get('/checkout', (req, res) => {
  if (req.session.user) {
    if (!req.session.user.isclerk) {
      // fetch the list of items
      var userCart = [];
      userDb.find({ _id: req.session.user._id },  (err, docs) => {
        // console.log(docs);
        userCart = docs[0].userCart;

        if (userCart.length === 0) {
          // nothing in cart
          res.render("general/wcCustomer.hbs", {
            hasDat: false,
            itmsnumCart: 0
          });
        } else {
          let myList = [];
          const dumLenx = userCart.length;
          let totalCost = 0;
          for (let indxx = 0; indxx < dumLenx; indxx++) {
            const elem = userCart[indxx];
            const dummy =  db.find({ _id: elem.item }, (err, docs) => {
              if (docs.length === 0) {
                return;
              }
              let thisDat = {
                "prodId": docs[0]._id,
                "title": docs[0].title,
                "price": docs[0].price,
                "quantity": elem.count,
                "imageUrl": docs[0].imageUrl,
                "totalPrice": docs[0].price * elem.count
              }
              totalCost += docs[0].price * elem.count;
              myList.push(thisDat);
            }).clone().lean();
          }
          // send email with order summary
          // purposed delay to wait while server db updates.
          setTimeout(() => {

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            let sendMsg = `Thank You ${req.session.user.firstName} ${req.session.user.lastName} For buying with us.<br /> Here's your order summary: <br />`;
            for (let ix = 0; ix < myList.length; ix++) {
              sendMsg += `<br />${ix + 1}. ${myList[ix].title}, (${myList[ix].quantity}), ($${myList[ix].price})/piece, TOTAL: $ ${myList[ix].totalPrice}`
            }
            var msg = {
              to: "tangodon280@gmail.com", //email
              from: "mdhami7@myseneca.ca",
              subject: "Order Summary",
              html: sendMsg
            };

            sgMail.send(msg).then(() => {
              console.log("Success, validation passed and email has been sent.");
              })
              .catch(err => {
                console.log(err);
              });

            // clear cart
            let emptyArray = [];
            userDb.updateOne({ _id: req.session.user._id }, {
              "$set": {
                "userCart": emptyArray
              }
            })
              .then(() => {
                // purposed delay so that database is updated in the backend.
                // purposed delay to avoid errors
                setTimeout(() => {
                  res.render("general/ordersummary.hbs", {
                    hasDat: true,
                    itmsnumCart: dumLenx,
                    totalOverallCost: totalCost.toFixed(2),
                    docs: myList
                  });

                });



              }, 1000);
          }, 1000)

        }

      }).clone().lean();



    } else {
      res.redirect("/clerk/list-mealkits");
    }
  } else {
    res.redirect("/user/login");
  }

});

module.exports = router;
