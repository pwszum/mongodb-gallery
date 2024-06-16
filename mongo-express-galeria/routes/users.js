var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

router.get('/', user_controller.user_list);
router.get('/user_add', user_controller.user_add_get);
router.post('/user_add', user_controller.user_add_post);

router.get('/user_login', user_controller.user_login_get);
router.post('/user_login', user_controller.user_login_post);
router.get('/user_logout', user_controller.user_logout_get);

router.get('/newuser/', function(req, res, next) {
  res.send('This is a new user');
});

module.exports = router;
