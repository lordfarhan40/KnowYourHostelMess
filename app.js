const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const sha = require('sha256');
const validator = require('./utility/validator.js');
const users = require('./models/users.js');
const port = process.argv[2];
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express();
app.use(express.static(__dirname +'/public/'));
app.set('view engine', 'hbs');




app.get('/', (request, response) => {
	response.render('index');
});

app.get('/LoginPage', (request, response) => {
	response.render('LoginPage');
});


app.post('/AdminPage', urlencodedParser, (request, response) => {
	var userID = request.body.id_text;
	var password = request.body.password_text;
	validator.validUserID(userID, (error, result) => {
		if(result !== true)
			console.log(error);
	});

	validator.validPassword(password, (error, result) => {
		if(result !== true)
			console.log(error);
	});

	password = sha(password);

	users.getUserById(userID, (error, result) => {
		if(error)
			console.log(error);
		else {
			if(userID != result.id || password != result.password)
				console.log('Unable to recognize user');
			else {
				response.render('/LoginSuccess', {
					name: result.name,
					isAdmin: result.isAdmin,
					contact: result.contact,
					hostel_id: result.hostel_id
				});
			}
		}
	})
})


app.listen(port, () => {
	console.log(`Server is listenning on port: ${port}`);
});