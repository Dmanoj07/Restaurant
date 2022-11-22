const express =require("express");
const router = express.Router();
const meals = require("../models/mealkit-db");

//Route to default page
router.get("/", (req,res) =>{
   
    res.render("general/index.hbs", {
        mealList: meals.getTopMealkits(),
        title: "Home Page"
    });
});

// route to menu page
router.get("/onthemenus", (req,res) =>{
    res.render("general/onthemenus",
    {
        mealList: meals.getMealkitsByCategory(),
        title: "Menu Page"
    });
});

module.exports = router;