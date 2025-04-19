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
const nodemailer = require("nodemailer");
//const multer = require('multer');
//dotenv.config();
//console.log(dotenv);
//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Importing Student Model
const { Student, Contact } = require("./Models/Students.js");

// Connecting to MongoDB
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
const contactMessagesPage = fs.readFileSync(path.join(__dirname, "Templates/Contact-messages.html"), "utf8");
const dataObject = JSON.parse(data); // data converted into JSON format

app.use(express.static(path.join(__dirname)));
//homepage route
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

//enrolling course
app.get('/enroll', (req, res) => {
  res.set('content-type', "text/html");
  const output = enrollForm;
  res.send(output);
});

app.get('/api', (req, res) => {
  res.set('content-type', 'application/json')
  res.send(data);
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, dob, gender, course } = req.body;
    if (await Student.findOne({ email })) {
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
    // Password validation for Minimum 8 characters, at least 1 letter and 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      // Warning message into the enrollment form
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

    // Creating a new student and saving to the database
    const student = new Student({ fullName, email, password, dob, gender, course });
    await student.save();


    res.set('content-type', "text/html");
    res.send(welcomeCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//login route
app.get('/login', (req, res) => {
  res.set('content-type', "text/html");
  res.send(login);
})
// Forgot Password Page Route
app.get('/forgot-password', (req, res) => {
  const forgotPasswordPage = fs.readFileSync(path.join(__dirname, "Templates/forgot-password.html"), "utf8");
  res.set('Content-Type', 'text/html');
  res.status(200).send(forgotPasswordPage);
});

// Forgot Password Logic
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Checking if the email exists in the database
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).send(`
        <script>
          alert("This email is not registered.");
          window.location.href = '/forgot-password';
        </script>
      `);
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Storing OTP and expiration time in the database
    student.resetOTP = otp;
    student.otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await student.save();

    // Setting up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tofsircseiu@gmail.com",
        pass: "kjam wamx xcpe trbo", //app password used
      },
    });

    // Email options
    const mailOptions = {
      from: "tofsircseiu@gmail.com", // Sender address
      to: email, // Receiver's email
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Redirect to the reset-password page
    res.status(200).send(`
      <script>
        alert("OTP sent successfully. Please check your email.");
        window.location.href = '/reset-password';
      </script>
    `);
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).send(`
      <script>
        alert("An error occurred. Please try again later.");
        window.location.href = '/forgot-password';
      </script>
    `);
  }
});
// Reset Password Page Route
app.get('/reset-password', (req, res) => {
  const resetPasswordPage = fs.readFileSync(path.join(__dirname, "Templates/reset-password.html"), "utf8");
  res.set('Content-Type', 'text/html');
  res.status(200).send(resetPasswordPage);
});

// Reset Password Logic
app.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).send(`
        <script>
          alert("Passwords do not match.");
          window.location.href = '/reset-password';
        </script>
      `);
    }
    // if (newPassword !== confirmPassword) {
    //   const warningMessage = `
    //     <p style="color: red; font-size: 1rem; text-align: center;">
    //       <i>*Password doesn't matched*</i>
    //     </p>
    //   `;
    //   const updatedPage = resetPasswordPage.replace(
    //     '<p id="errorMessage"></p>',
    //     `${warningMessage}`
    //   );
    //   return res.status(400).send(updatedPage);
    // }
    // Check if the email exists in the database
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).send(`
        <script>
          alert("This email is not registered.");
          window.location.href = '/reset-password';
        </script>
      `);
    }

    // Checking if the OTP matches and is not expired
    if (student.resetOTP !== otp || new Date() > student.otpExpiresAt) {
      return res.status(400).send(`
        <script>
          alert("Invalid or expired OTP.");
          window.location.href = '/reset-password';
        </script>
      `);
    }

    // Updating the password and clearing the OTP
    student.password = newPassword;
    student.resetOTP = null;
    student.otpExpiresAt = null;
    await student.save();

    // Show success message and redirect to login page
    res.status(200).send(`
      <script>
        alert("Your password has been reset successfully. You can now log in with your new password.");
        window.location.href = '/login';
      </script>
    `);
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).send(`
      <script>
        alert("An error occurred. Please try again later.");
        window.location.href = '/reset-password';
      </script>
    `);
  }
});

app.get('/loggedin', async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;

    // Finding student by email
    const studentInfo = await Student.findOne({ email });

    if (!studentInfo) {
      return res.send(`<script>alert("Session timeout. Redirect to login page!"); window.location.href='/login';</script>`);
    }

    // verifing the password before logging in 
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
app.post('/submit-contact', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    //console.log(fullName, email, message);
    // Creating a new contact and save to the database
    const contact = new Contact({ fullName, email, message });
    await contact.save();
    const messages = await Contact.find({ email }).select({ fullName: 1, message: 1 });
    //console.log(messages);
    //const name = messages[0].fullName;
    let messageContent = "";
    for (let i = 0; i < messages.length; i++) {
      messageContent += `<p>${messages[i].message}</p>`;
    }
    const output = contactMessagesPage.replace(/{%MAIL%}/g, email).replace(/{%MESSAGES%}/g, messageContent);
    //const output = replaceTemplate(contactMessagesPage, messages);
    //console.log(messages);
    // Send a success response
    res.status(200).send(output);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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