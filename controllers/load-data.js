const express = require("express");
const router = express.Router();
const mealsModule = require("../models/mealkit-db");
const db = mealsModule.mealModel;

router.get('/meal-kits', (req, res) => {
  // check for authorization
  if (req.session && req.session.user && req.session.user.isclerk) {
    // check if data already exists in the db

    db.find().count({}, (err, count) => {
      let status = "Authorized";
      if (count === 0) {
        // db empty, populate it
        // upload image in db as well
        db.insertMany(mealsModule.getTopMealkits(), (err, docs) => {
          if (err) {
            status = "dberror";
          }
          else {
            status = "success";
          }
          res.render("general/loadData.hbs", {
            status: status
          });
        });

      }
      // if error
      else {

        if (err) {
          status = "dberror";
        }
        // if data already present
        else {
          status = "present";
        }
        res.render("general/loadData.hbs", {
          status: status
        });
      }
      // render the view

    });
  }
  else {
    res.render("general/loadData.hbs", {
      status: "unauthorized"
    });
  }


});

module.exports = router;
