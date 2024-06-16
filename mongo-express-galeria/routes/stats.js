var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Gallery = require('../models/gallery');
const Image = require('../models/image');

/* GET stats page. */
router.get('/', async function(req, res, next) {

  const usersCount = await User.countDocuments();
  const galleriesCount = await Gallery.countDocuments();
  const imagesCount = await Image.countDocuments();

  res.send(`Liczba użytkowników: ${usersCount}, Liczba galerii: ${galleriesCount}, Liczba obrazów: ${imagesCount}`);
});

module.exports = router;
