var express = require('express');
var router = express.Router();

const gallery_controller = require("../controllers/galleryController");
const authenticate = require('../middleware/authenticate');

router.get('/', gallery_controller.gallery_list);
router.get('/gallery_add', authenticate, gallery_controller.gallery_add_get);
router.post('/gallery_add', authenticate, gallery_controller.gallery_add_post);
router.get('/gallery_browse', gallery_controller.gallery_browse);
router.post('/gallery_browse', gallery_controller.gallery_browse);
router.get('/gallery_delete', authenticate, gallery_controller.gallery_delete_get);
router.post('/gallery_delete', authenticate, gallery_controller.gallery_delete_post);
module.exports = router;
