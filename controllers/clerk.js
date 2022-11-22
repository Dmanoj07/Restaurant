const express = require("express");
const router = express.Router();

router.get('/list-mealkits', (req, res) => {
  if (req.session.user) {
    if (req.session.user.isclerk) {
      res.render("general/wcClerk.hbs");
    } else {
      res.redirect("/customer/cart");
    }
  } else {
    res.redirect("/user/login");
  }

});

module.exports = router;