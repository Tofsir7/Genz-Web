const fs = require('fs');

const jwt = require('jsonwebtoken');
const { Student } = require('../Models/Students');

const enrollRoute = async (req, res) => {
  let enrollForm = fs.readFileSync('Templates/Enroll-form.html', "utf8");

  // Check for login token
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Student.findOne({ email: decoded.email });

      if (user) {
        // Auto-fill Data
        enrollForm = enrollForm.replace('name="fullName" placeholder="Enter your full name"', `name="fullName" value="${user.fullName}" readonly`);
        enrollForm = enrollForm.replace('name="email" placeholder="Enter your email"', `name="email" value="${user.email}" readonly`);

        // Change form action to enrollment route
        enrollForm = enrollForm.replace('action="/register"', 'action="/enroll-course"');
      }
    } catch (err) {
      console.log("Token verification failed in enroll:", err.message);
    }
  }

  res.set('content-type', "text/html");
  res.send(enrollForm);
}

module.exports = enrollRoute;