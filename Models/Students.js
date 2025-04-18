const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  course: { type: String, required: true },
  resetOTP: { type: String, default: null }, 
  otpExpiresAt: { type: Date, default: null },
});

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);
const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Student, Contact };
