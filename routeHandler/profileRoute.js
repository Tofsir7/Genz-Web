const fs = require('fs');
const bcrypt = require('bcrypt');
const replaceTemplate = require('../Controller/replaceTemplate');
const {Student} = require('../Models/Students')

const profileRoute = async (req, res) => {
  try {
    const profile = fs.readFileSync("Templates/profile.html", "utf8");
    const login = fs.readFileSync("Templates/login.html", "utf8");
    const {email,password} = req.body;
    
    const studentInfo = await Student.findOne({ email });
    //console.log('Student Info:', studentInfo);

    if (!studentInfo) {
      let output = login.replace('<p id="ERROR">','<p style="color: red;">Invalid Credentials!</p>')
      return res.send(output);
    }

    const isMatch = await bcrypt.compare(password, studentInfo.password);
    if (!isMatch) {
      let output = login.replace('<p id="ERROR">','<p style="color: red;">Invalid Credentials!</p>')
      return res.send(output);
    }

    // req.session.user = {
    //   email: studentInfo.email,
    //   fullName: studentInfo.fullName,
    //   course: studentInfo.course
    // };
    //console.log('Session:', req.session);

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