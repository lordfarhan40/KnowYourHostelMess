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

app.get('/Register',(request,response)=>{
	response.render('Register');
});

app.post('/RegisterUser',urlencodedParser,(request,response)=>{   //user registration
	if(request.body.uid  === undefined){
		response.send('Please Give Currect Information');
		return;
	}
	var id = request.body.uid;
	var password = sha(request.body.password);
	var isAdmin = 0;
	var contact = request.body.contact;
	var hostel_id = request.body.hostel_id;
	var name = request.body.name;
	users.getUserById(id,(error,result)=>{
		if(error){
			console.log(error);
		}
		else if(result.id === undefined){
			users.createUser({
				id,
				password,
				isAdmin,
				contact,
				hostel_id,
				name
			},(error,result)=>{
				if(error)
					console.log(error);
				else{
					console.log('user added');
					response.send('user successfully registered');
				}
			});	
		}
		else{
			console.log('user Already exist');
			response.send('User ID is Already Exist');
		}

	});
});


app.post('/AdminPage', urlencodedParser, (request, response) => {
	var userID = request.body.id_text;
	var password = request.body.password_text;
	// validator.validUserID(userID, (error, result) => {
	// 	if(result !== true)
	// 		console.log(error);
	// });

	// validator.validPassword(password, (error, result) => {
	// 	if(result !== true)
	// 		console.log(error);
	// });

	//password = sha(password);

	users.getUserById(userID, (error, result) => {
		if(error)
			console.log(error);
		else {
			if(userID !== result.id || password !== result.password) {
				response.render('LoginPage');
				response.send('<h1 color=red>Unable to recognize user</h1>');
				console.log('Unable to recognize user');
			}
			else {
				response.render('LoginSuccess', {
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