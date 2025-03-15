const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const express = require("express")
const app = express();
const replaceTemplate = require("./Modules/replaceTemplate");  // rtemplate replace korar module ta require kora hoyeche
const tempHome = fs.readFileSync(path.join(__dirname, "Page.html"), "utf8"); // home er template ta file the read kora hoyeche
const tempCourse = fs.readFileSync(path.join(__dirname, "Templates/Template-course.html"), "utf8"); // course er template
const welcomeCard = fs.readFileSync(path.join(__dirname, "Templates/welcome-card.html"), "utf8");
const data = fs.readFileSync("Dev-data/data.json"); // data gula read kora hoyeche as STRING format
const enrollForm = fs.readFileSync(path.join(__dirname, "Templates/Enroll-form.html"), "utf8"); // enroll korar form
const dataObject = JSON.parse(data); // data converted into JSON format
app.use(express.json())
//homepage
app.get(['/home', '/'], (req, res) => {
  res.set('Content-Type', 'text/html');
  let output = tempHome;
  let path = `"https://raw.githubusercontent.com/Tofsir7/Genz-Web/refs/heads/master/Images/GenZ-logo.png"`;
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

app.get('/register', async (req, res) => {
  console.log(req.query);
  const student = new Student(req.body);
  console.log(student);
});

//form data submission
// app.post('/register', async (req, res) => {
//   try {
//     console.log(req.body)
//     const student = new Student(req.body);
//     await student.save();
//     res.status(201).json(student);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  course: { type: String, required: true }
});

const Student = mongoose.model('User', studentSchema);

module.exports = Student;




// start server
const port = 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port: ${port}`);
})