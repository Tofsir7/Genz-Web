//requiring resources
const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');


dotenv.config();
const authentication = require("./Controller/authController.js");
//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Importing Path
const courseRoute = require("./routeHandler/courseRoute.js");
const homeRoute = require("./routeHandler/homeRoute.js");
const registerRoute = require('./routeHandler/registerRoute.js');
const enrollRoute = require('./routeHandler/enrollRoute.js');
const forgotPasswordRoute = require('./routeHandler/forgotPasswordRoute.js');
const resetPasswordRoute = require('./routeHandler/resetPasswordRoute.js');
const submitContactRoute = require('./routeHandler/submitContactRoute.js');
const profileRoute = require("./routeHandler/profileRoute.js");
const loginRoute = require('./routeHandler/loginRoute.js');
const logoutRoute = require('./routeHandler/logoutRoute.js')

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));


app.use('/images', express.static(path.join(__dirname, 'Images')));
app.use('/design', express.static(path.join(__dirname, 'Design')));
// reading files


const contactPage = fs.readFileSync(path.join(__dirname, "Templates/Contact.html"), "utf8");
const blogPage = fs.readFileSync(path.join(__dirname, "Templates/Blog.html"), "utf8");


//GET requests
app.get(['/home', '/'], homeRoute);
app.get('/course/:id', courseRoute);
app.get('/enroll', enrollRoute);
app.get('/login', loginRoute)
app.get('/profile', authentication); //Autharisation korbo (TODO)
app.get('/logout', logoutRoute);

//POST requests
app.post('/profile', profileRoute)
app.post('/forgot-password', forgotPasswordRoute);
app.post('/reset-password', resetPasswordRoute);
app.post('/register', registerRoute);

// Chat Route
const chatRoute = require('./routeHandler/chatRoute.js');
app.post('/api/chat', chatRoute);

// Admin Route
const adminRoute = require('./routeHandler/adminRoute.js');
const adminAuth = require('./Controller/adminAuth.js');
app.use('/admin', adminAuth, adminRoute);


// Contact page route
app.get('/contact', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(contactPage);
});
app.post('/submit-contact', submitContactRoute);
// Blog page route
app.get('/blog', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(blogPage);
});
app.get('/forgot-password', (req, res) => {
  const forgotPasswordPage = fs.readFileSync(path.join(__dirname, "Templates/forgot-password.html"), "utf8");
  res.set('Content-Type', 'text/html');
  res.status(200).send(forgotPasswordPage);
});
app.get('/reset-password', (req, res) => {
  const resetPasswordPage = fs.readFileSync(path.join(__dirname, "Templates/reset-password.html"), "utf8");
  res.set('Content-Type', 'text/html');
  res.status(200).send(resetPasswordPage);
});


module.exports = app;