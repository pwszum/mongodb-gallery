const Image = require("../models/image");
const Gallery = require("../models/gallery");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.image_list = asyncHandler(async (req, res, next) => {
  const all_images = await Image.find({}).populate("gallery").exec();
  res.render("image_list", { title: "Images", image_list: all_images });
});

exports.image_add_get = asyncHandler(async (req, res, next) => {
  const all_galleries = await Gallery.find().sort({ last_name: 1 }).exec();
  res.render("image_form", { title: "Add image", galleries: all_galleries });
});

exports.image_add_post = [
  upload.single('image'),

  body("i_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Image name too short."),

  body("i_description")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Description too short."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const image = new Image({
      name: req.body.i_name,
      description: req.body.i_description,
      path: req.file ? `/images/${req.file.filename}` : '',
      gallery: req.body.i_gallery,
    });

    if (!errors.isEmpty()) {
      const all_galleries = await Gallery.find().sort({ last_name: 1 }).exec();
      res.render("image_form", { title: "Add image", galleries: all_galleries, errors: errors.array() });
      return;
    }

    const imageExists = await Image.findOne({
      name: req.body.i_name,
      path: image.path,
    })
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (imageExists) {
      res.send("Image exists");
    } else {
      await image.save();
      res.redirect("/galleries/gallery_browse");
    }
  }),
];

exports.image_edit_get = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id).populate('gallery').exec();
  const all_galleries = await Gallery.find().sort({ name: 1 }).exec();
  if (!image) {
    return next(new Error('Image not found'));
  }
  res.render("image_form_edit", { title: "Edit Image", image: image, galleries: all_galleries });
});

exports.image_edit_post = [
  body("i_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Image name too short."),
  
  body("i_description")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Description too short."),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedFields = {
      name: req.body.i_name,
      description: req.body.i_description,
      gallery: req.body.i_gallery
    };

    if (!errors.isEmpty()) {
      const all_galleries = await Gallery.find().sort({ name: 1 }).exec();
      res.render("image_form_edit", { title: "Edit Image", image: updatedFields, galleries: all_galleries, errors: errors.array() });
      return;
    } else {
      await Image.findByIdAndUpdate(req.params.id, updatedFields);
      res.redirect("/galleries/gallery_browse");
    }
  })
];

exports.image_delete = asyncHandler(async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id).exec();
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: "Failed to delete image" });
  }
});