// Requires
const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const sha = require('sha256');
const validator = require('./utility/validator.js');
const users = require('./models/users.js');
const port = process.argv[2];
const bodyParser = require('body-parser');
const hostel = require('./models/hostels.js');
const htmlGenerator = require('./utility/htmlGenerator.js');
const fileUpload = require('express-fileupload');
const mess_bills=require('./models/mess_bills.js');

// Initial setup for node
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var app = express();
app.use(express.static(__dirname +'/public/'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname +'/views/partials/');
app.use(fileUpload());
/* 
	Main Page will contain list of hostels and links for login
*/

require('./admin.js').setUpRoutes(app);

app.get('/', (request, response) => {
	//Getting hostel list from database
	hostel.getHostelsList((error, result) => {
		if(error !== undefined) 
		else {
			console.log(`${result.length} Hostels found in database`);
			/* 
				Below part is a sample how to send data to html page
				Grabbing all the hostel lists from database and then converting it to a
				viewable html table using the htmlGeneraor 
				(Will be replaced with other viewable object in html)
			*/
			var hostel = [];
			result.forEach((x) =>{
				hostel.push({hostelName: x.name, hostelId: x.hid});
			});
			response.render('index', { 
				hostel,
				user:request.user
			});
		}
	});
});


app.get("/hostel",(req,res)=>
{
	var hostelId=req.query.hid;
	console.log('hostel id ',hostelId);
	hostel.getHostelById(hostelId,(err,queryRep)=>
	{
		if(err){
			console.log(err);
			return;
		}
		hostel.name=queryRep.name;
		hostel.pde=queryRep.pde;
		hostel.hid=queryRep.hid;		//Temp for image display
		hostel.description=queryRep.description;
		console.log(queryRep);
		mess_bills.getBillsByHid(hostelId,(err,bills)=>
		{
			console.log(err);
			res.render("hostel.hbs",{
				hostel,
				user: req.user,
				mess_bills:bills
			});
		});
	});
});


app.listen(port, () => {
	console.log(`Server is listenning on port: ${port}`);
});