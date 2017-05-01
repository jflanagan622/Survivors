// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company
var express = require('express');
var app = express();

// Set the port to listen on. 80 since it's the web server
// NOTE: su usually required for ports under 1024
app.set('port', process.env.PORT || 3001);

// Setup to serve static files
app.use(express.static(__dirname + '/public'));

// Morgan for logging
var morgan = require('morgan');
app.use(morgan(':date :remote-addr :method :url :status :response-time ms - :res[content-length]'));

// Add / Setup handlebars view engine
var handlebars = require('express-handlebars');
// Point to a default template
app.engine('handlebars', handlebars({defaultLayout: 'main'}));

// Add handlebars to the app
app.set('view engine', 'handlebars');

// Kill cache 304 response
app.disable('etag');

//-----------------------------------------
// Startup the server
app.listen(app.get('port'), function(){
	console.log( 'The Web Server is running. Open a browser and navigate to: http://localhost:3001/');
});

//-----------------------------------------
// Cart routes 
//-----------------------------------------
// Default page
app.get('/', function(req,res) {
	res.render('home');
});

// Shop Page
app.get("/shop", function (req, res) {
	res.render('shop', {layout: 'cart'});
});

// Cart Page
app.get("/cart", function (req, res) {
	res.render('cart', {layout: 'cart'});
});

// Checkout Page
app.get("/checkout", function (req, res) {
	res.render('checkout', {layout: 'cart'});
});

//-----------------------------------------
// Customer routes
//-----------------------------------------
// Stub of signup page
app.get("/signup", function (req, res) {
	// Send the login page
	res.render('signup');
});

// Stub of login page
app.get("/login", function (req, res) {
	// Send the login page
	res.render('login');
});

// Page to update Customers in the Database
app.get("/updatecustomer/:id", function (req, res) {
	// Send the Update Customer page and pass in the :id 
	// and the URL to return to after saving in the update page
    res.render('updatecustomer', {layout: 'adminmain', id: req.params.id, return_to: req.params.return_to});
});

//-----------------------------------------
// Admin and Dashboard pages
//-----------------------------------------
// Send the Admin page
app.get("/admin", function (req, res) {
	// Note we are also changing from the main layout
	// to the Admin one; not just the body
    res.render('adminbody', {layout: 'adminmain', inventory_cost : "$0.00"});
});

// Generic Page to view Database tables
app.get("/viewdata", function (req, res) {
	// Send the Add Product page
    res.render('viewdata', {layout: 'adminmain'});
});

//-----------------------------------------
// Product pages
//-----------------------------------------
// Page to add products to the Database
app.get("/addproduct", function (req, res) {
	// Send the Add Product page
    res.render('addproduct', {layout: 'adminmain'});
});

// Page to update products in the Database
app.get("/updateproduct/:id", function (req, res) {
	// Send the Update Product page and pass in the :id 
	// and the URL to return to after saving in the update page
    res.render('updateproduct', {layout: 'adminmain', id: req.params.id, return_to: req.params.return_to});
});

// Generic Page to view Database tables
app.get("/viewdata", function (req, res) {
	// Send the Add Product page
    res.render('viewdata', {layout: 'adminmain'});
});

//-----------------------------------------
// Product Type pages
//-----------------------------------------
// Page to add product types to the Database
app.get("/addproducttype", function (req, res) {
	// Send the Add Product page
    res.render('addproducttype', {layout: 'adminmain'});
});

// Generic Page to view Database tables
app.get("/viewdata", function (req, res) {
	// Send the Add Product page
    res.render('viewdata', {layout: 'adminmain'});
});

//-----------------------------------------
// Scent Type pages
//-----------------------------------------
// Page to add scents to the Database
app.get("/addscenttype", function (req, res) {
	// Send the Add Product page
    res.render('addscenttype', {layout: 'adminmain'});
});

// Generic Page to view Database tables
app.get("/viewScentTypes", function (req, res) {
	// Send the Add Product page
    res.render('viewscenttypes', {layout: 'adminmain'});
});

//-----------------------------------------
// Extra and Utility pages
//-----------------------------------------
app.get('/pretty', function(req,res) {
	// Send the construction page
	res.render('homepretty');
});

// Construction
app.get('/construction', function(req,res) {
	// Send the construction page
	res.render('construction');
});

//-----------------------------------------
// Finally If no routes match, send the 404 page
app.use(function(req,res) {
	res.status(404);
	// Send 404 status code
	res.render('404');
});

