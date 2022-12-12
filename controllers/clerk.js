const express = require("express");
const router = express.Router();
const mealsModule = require("../models/mealkit-db");
const db = mealsModule.mealModel;
const path = require('path');

router.get('/list-mealkits', (req, res) => {
  if (req.session.user) {
    if (req.session.user.isclerk) {
      // get all data from the db
      db.find({}, (err, docs) => {
        if (err) {
          res.render("general/wcClerk.hbs", {
            error: "error",
            docs: []
          });
        } else {
          res.render("general/wcClerk.hbs", {
            error: "none",
            docs: docs
          });
        }

      }).lean();

    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }

});

router.get('/add-mealkit', (req, res) => {
  if (req.session.user) {
    if (req.session.user.isclerk) {
      const datS = {
        title: "",
        includes: "",
        description: "",
        category: "",
        price: "",
        cookingTime: "",
        servings: "",
        imageUrl: "",
        topMeal: "",
        update: "false",
        buttonName: "Add New Data"
      };
      res.render("general/formMealkit.hbs", {
        data: datS
      });
    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }
});

// edit the mealkit
router.get('/edit-mealkit/:id', (req, res) => {
  if (req.session.user) {
    if (req.session.user.isclerk) {
      const userIdToEdit = req.params.id.substring(1);
      console.log("userId: ", userIdToEdit);
      // fetch the data from the server with this id
      db.find({ _id: userIdToEdit }, (err, docs) => {
        docs = docs[0];
        const datS = {
          title: docs.title,
          includes: docs.includes,
          description: docs.description,
          category: docs.category,
          price: docs.price,
          cookingTime: docs.cookingTime,
          servings: docs.servings,
          topMeal: docs.topMeal,
          update: userIdToEdit,
          buttonName: "Update Info"
        };
        res.render("general/formMealkit.hbs", {
          data: datS
        });
      })

    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }
});

router.get('/remove-mealkit/:id', (req, res) => {
  if (req.session.user) {
    if (req.session.user.isclerk) {
      db.deleteOne({ _id: req.params.id.substring(1) }).then(() => {
        res.redirect("/clerk/list-mealkits");
      })
        .catch((err) => {
          console.log("Something went wrong.");
          res.redirect("/clerk/list-mealkits");
        });

    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }
});

// handles both add 
router.post('/add-mealkit', (req, res) => {
  // check authentication
  if (req.session.user) {
    if (req.session.user.isclerk) {
      // check if add or update
      const myDat = {
        title: req.body.title,
        includes: req.body.includes,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        cookingTime: req.body.cookingTime,
        servings: req.body.servings,
        topMeal: req.body.topMeal ? true : false
      };

      // add new
      if (req.files) {
        // if image provided
        const uniqueName = `user-${Date.now()}-${Math.random()}-${path.parse(req.files.imageUrl.name).ext}`;
        req.files.imageUrl.mv(`assets/img/${uniqueName}`).then(() => {
          myDat.imageUrl = "/img/" + uniqueName;
          db.insertMany(myDat).then(() => {
            res.redirect("/clerk/list-mealkits");
          })
            .catch((err) => {
              res.redirect("/clerk/list-mealkits");
            });
        });
      } else {
        // if no image provided, do nothing
        db.insertMany(myDat).then(() => {
          res.redirect("/clerk/list-mealkits");
        })
          .catch((err) => {
            res.redirect("/clerk/list-mealkits");
          });
      }




    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }

});

// handles update info
router.post('/edit-mealkit/add-mealkit', (req, res) => {
  if (req.session.user) {
    if (req.session.user.isclerk) {
      // check if add or update
      const myDat = {
        title: req.body.title,
        includes: req.body.includes,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        cookingTime: req.body.cookingTime,
        servings: req.body.servings,
        topMeal: req.body.topMeal ? true : false
      };
      // update
      if (req.body.hiddenText !== "false") {
        console.log("updating:", req.body.hiddenText);

        if (req.files) {
          // if image provided
          const uniqueName = `user-${Date.now()}-${Math.random()}-${path.parse(req.files.imageUrl.name).ext}`;
          req.files.imageUrl.mv(`assets/img/${uniqueName}`).then(() => {
            myDat.imageUrl = "/img/" + uniqueName;

            db.updateOne({ "_id": req.body.hiddenText }, { $set: myDat }).then(() => {
              res.redirect("/clerk/list-mealkits");
            })
              .catch((err) => {
                res.redirect("/clerk/list-mealkits");
              });
          });
        } else {
          // if no image provided
          db.updateOne({ "_id": req.body.hiddenText }, { $set: myDat })
            .then(() => {
              res.redirect("/clerk/list-mealkits");
            })
            .catch((err) => {
              res.redirect("/clerk/list-mealkits");
            });
        }

      } else {
        res.redirect("/clerk/list-mealkits");
      }

    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }
});

module.exports = router;
