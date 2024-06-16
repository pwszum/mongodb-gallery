const Gallery = require("../models/gallery");
const User = require("../models/user");
const Image = require("../models/image");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

const asyncHandler = require("express-async-handler");


exports.gallery_list = asyncHandler(async (req, res, next) => {
	const all_galleries = await Gallery.find({}).populate("user").exec();
	res.render("gallery_list", { title: "Galleries", gallery_list: all_galleries });
});


exports.gallery_add_get = asyncHandler(async (req, res, next) => {
	const all_users = await User.find().sort({last_name:1}).exec();
	if(req.user.username === 'admin') {
		res.render("gallery_form", { title: "Add gallery", users: all_users,});
	} else {
		res.render("gallery_form_user", { title: "Add gallery" });
	}
});

exports.gallery_add_post = [
  body("name")
    .trim()
	.isLength({ min: 2 })
	.escape()
	.withMessage("Gallery name too short."),

  body("description")
    .trim()
	.isLength({ min: 2 })
	.escape()
	.withMessage("Description too short."),

	asyncHandler(async (req, res, next) => {
		if (req.user.username === 'admin') {
			await body("user")
				.trim()
				.isLength({ min: 1 })
				.escape()
				.withMessage("User is required for admin")
				.run(req);
		}
		next();
	}),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		let loggedUser = await User.findOne({ username: req.user.username }).exec();

		const gallery = new Gallery({
			name: req.body.name,
			description: req.body.description,
			updated: new Date(),
			user: (req.user.username === 'admin') ? req.body.user : loggedUser,
		});

	if(!errors.isEmpty()) {
		const all_users = await User.find().sort({last_name:1}).exec();
		const adminAccount = await User.findOne({ username: 'admin' }).exec();
		if(req.user === adminAccount) {
			res.render("gallery_form", { title: "Add gallery", users: all_users,});
		} else {
			res.render("gallery_form_user", { title: "Add gallery" });
		}
		return;
	} else {
		const galleryExists = await Gallery.findOne({
			name: req.body.name,
			user: loggedUser,})
		.collation({ locale: "en", strength: 2 })
		.exec();

	if(galleryExists) {
		// res.redirect("/users");
		res.send("Gallery exists");
	} else {
		await gallery.save();
		res.redirect("/galleries/gallery_browse");
	}
	}
	}),
];

exports.gallery_browse = asyncHandler(async (req, res, next) => {
	const all_galleries = await Gallery.find({}).exec();
	res.render("gallery_browse", { title: "Select gallery:", galleries: all_galleries});
});

exports.gallery_browse = asyncHandler(async (req, res, next) => {
	const all_galleries = await Gallery.find({}).exec();
	const gallery_images = await Image.find({gallery: req.body.s_gallery}).exec();
	res.render("gallery_browse", { title: "View gallery:", galleries: all_galleries, images: gallery_images});
});

exports.gallery_delete_get = asyncHandler(async (req, res, next) => {
  try {
    const all_galleries = await Gallery.find({}).exec();
    res.render('gallery_form_delete', { title: 'Delete Gallery', galleries: all_galleries, errors: null });
  } catch (error) {
    console.error('Błąd podczas pobierania galerii:', error);
    res.status(500).json({ message: 'Nie udało się pobrać galerii' });
  }
});

exports.gallery_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const galleryId = req.body.s_gallery;

    if (!galleryId) {
      res.send('Pick gallery to delete');
      return;
    }

    const gallery = await Gallery.findById(galleryId).exec();
	const images = await Image.find({ gallery: galleryId }).exec();
    if (!gallery) {
      res.send('Gallery not found');
      return;
    }

    if (images.length > 0) {
      res.send('Gallery not deleted: it must be empty');
      return;
    }

    await Gallery.findByIdAndDelete(galleryId).exec();
    res.redirect('/galleries');
  } catch (error) {
    console.error('Błąd podczas usuwania galerii:', error);
	res.send('Error: Gallery not deleted');
	}
});