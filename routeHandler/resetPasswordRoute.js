const {Student} = require('../Models/Students')

const resetPasswordRoute= async (req, res) => {
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

    // Check if the email exists in the database
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).send(`
        <script>
          alert("This email is not registered to reset.");
          window.location.href = '/forgot-password';
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
}

module.exports = resetPasswordRoute;