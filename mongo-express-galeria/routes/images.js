var express = require('express');
var router = express.Router();

const image_controller = require("../controllers/imageController");
const authenticate = require('../middleware/authenticate');

/* GET images listing. */
router.get('/', image_controller.image_list);

/* GET image add */
router.get('/image_add/', authenticate, image_controller.image_add_get);

/* POST image add */
router.post('/image_add/', authenticate, image_controller.image_add_post);

/* GET image edit */
router.get('/image_edit/:id/', authenticate, image_controller.image_edit_get);

/* POST image edit */
router.post('/image_edit/:id/', authenticate, image_controller.image_edit_post);

/* DELETE image */
router.delete('/image_delete/:id/', authenticate, image_controller.image_delete);

module.exports = router;
