//requiring resources
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const express = require("express")
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const multer = require('multer');
//dotenv.config();\

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// 🛠️ Import Student Model
const Student = require("./Models/Students");

// 🔌 Connect to MongoDB
const MONGO_URI = "mongodb+srv://tofsir:3lUfyHtf1WAlK6qW@test.r9ibl.mongodb.net/genzit?retryWrites=true&w=majority&appName=test";
const config = { useNewUrlParser: true, useUnifiedTopology: true };
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, config);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectDB();



// reading files
const replaceTemplate = require("./Modules/replaceTemplate");  // required for replacing template
const tempHome = fs.readFileSync(path.join(__dirname, "Page.html"), "utf8");
const tempCourse = fs.readFileSync(path.join(__dirname, "Templates/Template-course.html"), "utf8");
const welcomeCard = fs.readFileSync(path.join(__dirname, "Templates/welcome-card.html"), "utf8");
const data = fs.readFileSync("Dev-data/data.json"); // data read as string format
const enrollForm = fs.readFileSync(path.join(__dirname, "Templates/Enroll-form.html"), "utf8");
const login = fs.readFileSync(path.join(__dirname, "Templates/login.html"), "utf8");
const profile = fs.readFileSync(path.join(__dirname, "Templates/profile.html"), "utf8");
const contactPage = fs.readFileSync(path.join(__dirname, "Templates/Contact.html"), "utf8");
const blogPage = fs.readFileSync(path.join(__dirname, "Templates/Blog.html"), "utf8");
const dataObject = JSON.parse(data); // data converted into JSON format

app.use(express.static(path.join(__dirname)));
//homepage
app.get(['/home', '/'], (req, res) => {
  res.set('Content-Type', 'text/html');
  let output = tempHome;
  let path = `"Images/GenZ-logo.png"`;
  output = output.replace(/{%logo%}/g, path);
  res.status(200).send(output);
});
// exploring the courses
app.get('/course', (req, res) => {
  const { query } = url.parse(req.url, true);
  const myobj = query;
  res.set('Content-Type', 'text/html');
  const coursePage = dataObject
    .map((el) => replaceTemplate(tempCourse, el))
    .join("");
  const course = dataObject[query.id];
  const output = replaceTemplate(tempCourse, course);
  res.send(output);
});

//enroll course
app.get('/enroll', (req, res) => {
  res.set('content-type', "text/html");
  const output = enrollForm;
  res.send(output);
});

app.get('/api', (req, res) => {
  res.set('content-type', 'application/json')
  res.send(data);
});

// Register Route (POST Request)
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, dob, gender, course } = req.body;
    if(await Student.findOne({ email })){
      const warningMessage = `
        <p style="color: red; font-size: 1rem; text-align: center;">
          <i>*This e-mail already registered*</i>
        </p>
      `;
      const updatedForm = enrollForm.replace(
        '<p id="validationErrorMessage"></p>',
        `${warningMessage}`
      );
      return res.status(400).send(updatedForm);
    }
    // Password validation: Minimum 8 characters, at least 1 letter and 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      // Inject the warning message into the enrollment form
      const warningMessage = `
        <p style="color: red; font-size: 1rem; text-align: center;">
          <i>*Password length should be atleast 8, 1 character and alphabet*</i>
        </p>
      `;
      const updatedForm = enrollForm.replace(
        '<p id="validationErrorMessage"></p>',
        `${warningMessage}`
      );
      return res.status(400).send(updatedForm);
    }
    
    // Create a new student and save to the database
    const student = new Student({ fullName, email, password, dob, gender, course });
    await student.save();

    // Send the welcome card upon successful registration
    res.set('content-type', "text/html");
    res.send(welcomeCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get('/login', (req, res) => {
  res.set('content-type', "text/html");
  res.send(login);
})
app.get('/loggedin', async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;

    // Find student by email
    const studentInfo = await Student.findOne({ email });

    if (!studentInfo) {
      return res.send(`<script>alert("Session timeout. Redirect to login page!"); window.location.href='/login';</script>`);
    }

    // verify the password before logging in 
    if (studentInfo.password !== password) {
      return res.send(`<script>alert("Invalid Credentials! Please try again."); window.location.href='/login';</script>`);
    }
    let output = replaceTemplate(profile, studentInfo);
    res.set('content-type', "text/html");
    res.send(output);
    // res.send("Hellow");
    //console.log(studentInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact page route
app.get('/contact', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(contactPage);
});

// Blog page route
app.get('/blog', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(blogPage);
});

// start server
const port = 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port: ${port}`);
});