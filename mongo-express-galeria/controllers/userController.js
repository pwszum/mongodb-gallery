const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.user_list = asyncHandler(async (req, res, next) => {
	const all_users = await User.find({}).exec();
	res.render("user_list", { title: "Users", user_list: all_users });
});

exports.user_add_get = (req, res, next) => {
	res.render("user_form", { title: "Add user"});
};

exports.user_add_post = [
  body("first_name")
    .trim()
	.isLength({ min: 2 })
	.escape()
	.withMessage("First name too short."),

  body("last_name")
    .trim()
	.isLength({ min: 2 })
	.escape()
	.withMessage("Last name too short."),

  body("username", "Username must contain at least 3 characters")
    .trim()
	.isLength({ min: 3 })
	.escape()
	.isAlpha()
	.withMessage("Username must be alphabet letters."),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
	.withMessage("Password must contain at least 8 characters."),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		
		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			password: hashedPassword,
		});

	if(!errors.isEmpty()) {
		res.render("user_form", {
			title: "Add user:",
			user: new User({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				username: req.body.username,
				password: req.body.password,
			}),
			errors: errors.array(),
		});
		return;
	} else {
		const userExists = await User.findOne({ username: req.body.username })
		.collation({ locale: "en", strength: 2 })
		.exec();

	if(userExists) {
		// res.redirect("/users");
		res.send("User exists");
	} else {
		await user.save();
		res.redirect("/users");
	}
	}
	}),
];

exports.user_login_get = (req, res, next) => {
	res.render("user_login_form", { title: "Login" });
};

exports.user_login_post = (req, res, next) => {
	let username = req.body.username
	let password = req.body.password
	
	User.findOne({ username }).then((user => {
		if(user) {
			bcrypt.compare(password, user.password, function (err, result) {
				if(err) {
					res.json({
						error: err
					})
				}
				if(result) {
					let token = jwt.sign({ username: user.username }, 'kodSzyfrujacy', {expiresIn: '1h' })
					res.cookie('mytoken', token, {maxAge: 600000});
					res.render('index', { title: 'Express' });
				} else {
					res.json({
						message: 'Złe hasło'
					})
				}
			})
		} else {
			res.json({ message: 'No user found!' })
		}
	}))
};

exports.user_logout_get = (req, res, next) => {
	res.clearCookie('mytoken', {
		sameSite: 'strict',
		httpOnly: true,
		signed: false
	});
	
	res.redirect('/');
};