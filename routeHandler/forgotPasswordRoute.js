const nodemailer = require("nodemailer");
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config();
const {Student} = require('../Models/Students')
const forgotPasswordRoute = async (req, res) => {
  try {
    const { email } = req.body;

    // Checking if the email exists in the database
    const student = await Student.findOne({ email });
    //console.log(`The student is: ${student}`);
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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, //app password used
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}. It is valid for 3 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    // const resetPasswordPgae = fs.readFileSync("Templates/reset-password.html", "utf8");
    // Redirect to the reset-password page
    res.status(200).send(`
      <script>
        alert("OTP sent successfully. Please check your email.");
        window.location.href = '/reset-password';
      </script>
    `);
    // window.location.href = '/reset-password';
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).send(`
      <script>
        alert("An error occurred. Please try again later.");
        window.location.href = '/forgot-password';
      </script>
    `);
  }
}

module.exports = forgotPasswordRoute;