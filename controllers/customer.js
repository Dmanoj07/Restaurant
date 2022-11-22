const express = require("express");
const router = express.Router();

router.get('/cart', (req, res) => {
  if (req.session.user) {
    if (!req.session.user.isclerk) {
      res.render("general/wcCustomer.hbs");

    } else {
      res.redirect("/clerk/list-mealkits");
    }
  } else {
    res.redirect("/user/login");
  }

});

module.exports = router;