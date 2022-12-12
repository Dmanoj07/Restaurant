const express = require("express");
const router = express.Router();
const meals = require("../models/mealkit-db");
const userDb = require("../models/userModel");
const db = meals.mealModel;
var allData = [];


router.get('/:id', (req, res) => {
  if (allData.length === 0) {
    db.find({}, (err, docs) => {
      if (err) {
        allData.push({ "error": "Error in fetching data", "_id": "null" });
      } else {
        allData = docs;
      }
      // send the response back
      const thisItem = allData.find((elem) => {
        return elem._id.toString() === req.params.id.substring(1);
      });
      res.render("general/mealPage.hbs", {
        item: thisItem
      });

    }).clone().lean();
  } else {
    const thisItem = allData.find((elem) => {
      return elem._id.toString() === req.params.id.substring(1);
    });
    // if data does not exist fetch from db again.
    res.render("general/mealPage.hbs", {
      item: thisItem
    });
  }


});

router.get('/buy/:id', (req, res) => {
  // function to add to cart if login, else redirect to login
  if (req.session.user) {
    if (!req.session.user.isclerk) {

      // add to cart 
      const itemToAdd = req.params.id.substring(1);
      userDb.find({ _id: req.session.user._id }, (err, docs) => {
        const cartList = docs[0].userCart;
        let isFound = false;
        let foundIndex = -1;
        if (cartList.length === 0) {
          isFound = false;
        } else {
          isFound = cartList.find((elem, ix) => {
            if (elem.item === itemToAdd) {
              foundIndex = ix;
              return true;
            }
            return false;
          });
        }

        // if cart is not empty
        if (isFound) {
          // increment quantity
          const newQuan = cartList[foundIndex].count + 1;
          userDb.updateOne({ _id: req.session.user._id, "userCart.item": itemToAdd }, {
            "$set": {
              "userCart.$.count": newQuan
            }
          })
            .then(() => {
              // purposed delay so that database is updated in the backend.
              setTimeout(() => {
                res.redirect("/customer/cart");
              }, 500);

            });



        } else {
          // data is not there
          const datToadd = {
            "item": req.params.id.substring(1),
            "count": 1
          };
          userDb.updateOne({ _id: req.session.user._id }, {
            $push: {
              userCart: datToadd
            }
          }).then(() => {
            // purposed delay so that database is updated in the backend.
            setTimeout(() => {
              res.redirect("/customer/cart");
            }, 500);
          });
        }
      })
        .clone().lean();




    } else {
      res.redirect("/clerk/list-mealkits");
    }
  } else {
    res.redirect("/user/login");
  }

});
module.exports = router;
