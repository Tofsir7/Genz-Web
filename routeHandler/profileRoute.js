const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const replaceTemplate = require('../Controller/replaceTemplate');
const { Student } = require('../Models/Students')
const profileRoute = async (req, res) => {
  try {
    const profile = fs.readFileSync("Templates/profile.html", "utf8");
    const login = fs.readFileSync("Templates/login.html", "utf8");
    const { email, password } = req.body;

    const studentInfo = await Student.findOne({ email });
    //console.log('Student Info:', studentInfo);

    if (!studentInfo) {
      let output = login.replace('<p id="ERROR">', '<p style="color: red;">Invalid Credentials!</p>')
      return res.send(output);
    }

    const isMatch = await bcrypt.compare(password, studentInfo.password);
    if (!isMatch) {
      let output = login.replace('<p id="ERROR">', '<p style="color: red;">Invalid Credentials!</p>')
      return res.send(output);
    }

    // token generation
    const token = jwt.sign({ email, password, role: studentInfo.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true })

    //console.log(`The token is : ${token}`);

    // Role-based redirection
    if (studentInfo.role === 'admin') {
      return res.redirect('/admin');
    }

    let output = replaceTemplate(profile, studentInfo);
    res.set('content-type', "text/html");
    return res.send(output);
  } catch (error) {
    console.log('Hi Tofsir! Middleware passed successfully.');
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = profileRoute;