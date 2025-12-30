const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  course: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  resetOTP: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
});

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})
const courseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  courseName: { type: String, required: true },
  courseDuration: { type: String },
  courseFee: { type: Number, required: true },
  image: { type: String },
  description: { type: String }
})
const Student = mongoose.model('Student', studentSchema);
const Contact = mongoose.model('Contact', contactSchema);
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = { Student, Contact, User, Course };
