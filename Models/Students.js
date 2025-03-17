const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true }, //unique: true  korte hobe
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  course: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
