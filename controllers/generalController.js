const express = require("express");
const router = express.Router();
const meals = require("../models/mealkit-db");
const db = meals.mealModel;

//Route to default page
router.get("/", (req, res) => {
    db.find({}, (err, docs) => {
        if (err) {
            res.render("general/index.hbs", {
                mealList: meals.getTopMealkits(),
                title: "Home Page"
            });
        } else {
            res.render("general/index.hbs", {
                mealList: docs,
                title: "Home Page"
            });
        }
    }).lean();

});

// route to menu page

router.get("/onthemenus", (req, res) => {
    // get data from server 
    db.find({}, (err, docs) => {
        if (err) {
            res.render("general/onthemenus",
                {
                    mealList: meals.getMealkitsByCategory(),
                    title: "Menu Page"
                });

        } else {
            // build category
            let filtered = [{
                category: "",
                meal: []
            }, {
                category: "",
                meal: []
            }];
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].category === "Vegan Meals") {
                    filtered[0].category = docs[i].category;

                    filtered[0].meal.push(docs[i]);
                }
                else {
                    filtered[1].category = docs[i].category;

                    filtered[1].meal.push(docs[i]);
                }
            }
            res.render("general/onthemenus",
                {
                    mealList: filtered,
                    title: "Menu Page"
                });
        }
    }).lean();
});

module.exports = router;
