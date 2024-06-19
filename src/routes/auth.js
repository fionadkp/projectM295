const express = require('express');


// eslint-disable-next-line new-cap
const router = express.Router();

function decodeHeader(authHeader) {
	const base64 = authHeader.split(' ')[1];
	// eslint-disable-next-line no-restricted-globals
	const encryptedbase64 = atob(base64);
	return encryptedbase64.split(':');
}

router.post('/login', async (req, res) => {
	// #swagger.summary = "Login with email and password to get access to the tasks";
	// #swagger.tags = ["Authentication"]
	// #swagger.parameters['email'] = { description: "Email of the user", required: true }
	// #swagger.parameters['password'] = { description: "Password of the user", required: true }
	/* #swagger.security = [{
                "basicAuth": []
        }]
  */
	// #swagger.description = "This route logs in the user with email and password to get access to the tasks. If the user is already logged in, a 200 status code is returned. If the user is not logged in, a 401 status code is returned."
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.setHeader('WWW-Authenticate', 'Basic');
		console.log('Authentication required (no header)');
		return res.status(401).send('authentication required');
	}

	const [email, password] = decodeHeader(authHeader);

	if (!email || !password) {
		console.log('Invalid input format');
		return res.status(400).send('Invalid input');
	}

	if (!email.includes('@') || !email.includes('.')) {
		console.log('Invalid email format');
		return res.status(400).send('Invalid email');
	}

	if (password === "m295") {
		req.session.user = email;
		console.log('Logged in as: ', req.session.user);
		return res.status(200).send(req.session);
	}

	res.status(401).send('credentials do not match');
});

router.get('/verify', (req, res) => {
	// #swagger.summary = "Verify if user is logged in";
	// #swagger.tags = ["Authentication"]
	// #swagger.description = "This route verifies if the user is logged in and returns the email of the user if logged in."
	if (req.session.user) {
		console.log('Verified: Logged in as: ', req.session.user);
		return res.setHeader('Content-Type', 'application/json').status(200).json({
			email: req.session.user,
		});
	}

	console.log('Verified: Not logged in');
	return res.sendStatus(401);
});

router.delete('/logout', (req, res) => {
	// #swagger.summary = "Logout the user from the server and delete the session cookie";
	// #swagger.tags = ["Authentication"]
	// #swagger.description = "This route logs out the user from the server and deletes the session cookie."
	req.session.destroy();
	res.sendStatus(200);
	console.log('Logged out user');
});
module.exports = router;
