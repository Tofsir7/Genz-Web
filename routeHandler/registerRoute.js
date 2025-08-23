const bcrypt = require("bcrypt");
const fs = require('fs');
const {Student} = require('../Models/Students')

const registerRoute = async (req, res) => {
  try {
    const welcomeCard = fs.readFileSync('Templates/welcome-card.html', "utf8");
    const enrollForm = fs.readFileSync('Templates/Enroll-form.html', "utf8");
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ fullName, email, password: hashedPassword, dob, gender, course });
    //const student = new Student({ fullName, email, password, dob, gender, course });
    await student.save();


    res.set('content-type', "text/html");
    res.send(welcomeCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = registerRoute