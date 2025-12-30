const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Student, Course } = require('./Models/Students');
const fs = require('fs');

dotenv.config();

const debugStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let output = "Connected.\n";

        const courses = await Course.find({});
        output += "\n--- COURSES ---\n";
        courses.forEach(c => {
            output += `Name: "${c.courseName}" | Fee: ${c.courseFee}\n`;
        });

        const students = await Student.find({ role: { $ne: 'admin' } });
        output += "\n--- STUDENTS ---\n";
        students.forEach(s => {
            output += `Student: ${s.fullName} | Course: "${s.course}"\n`;
        });

        fs.writeFileSync('debug_output.txt', output);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

debugStats();
