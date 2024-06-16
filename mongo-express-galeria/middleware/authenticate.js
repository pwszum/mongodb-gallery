const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
	try {
		const token = req.cookies.mytoken;
		const decode = jwt.verify(token, 'kodSzyfrujacy')
		
		req.user = decode
		next()
	}
	catch (err) {
		res.send('Login in first!')
	}
}

module.exports = authenticate