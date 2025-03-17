
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
//dotenv.config();

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
const replaceTemplate = require("./Modules/replaceTemplate");  // template replace korar module ta require kora hoyeche
const tempHome = fs.readFileSync(path.join(__dirname, "Page.html"), "utf8"); // home er template ta file the read kora hoyeche
const tempCourse = fs.readFileSync(path.join(__dirname, "Templates/Template-course.html"), "utf8"); // course er template
const welcomeCard = fs.readFileSync(path.join(__dirname, "Templates/welcome-card.html"), "utf8");
const data = fs.readFileSync("Dev-data/data.json"); // data gula read kora hoyeche as STRING format
const enrollForm = fs.readFileSync(path.join(__dirname, "Templates/Enroll-form.html"), "utf8"); // enroll korar form
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
  res.write(output);
});

//enroll course
app.get('/enroll', (req, res) => {
  res.set('content-type', "text/html");
  const output = enrollForm;
  res.write(output);
});

app.get('/api', (req, res) => {
  res.set('content-type', 'application/json')
  res.send(data);
});

// ✅ FIXED: Register Route (POST Request)
app.post('/register', async (req, res) => {
  try {

    // const data = req.body.JSON;
    // console.log(data); 
    const student = new Student(req.body);
    await student.save();
    res.set('content-type', "text/html");
    res.send(welcomeCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// start server
const port = 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port: ${port}`);
})