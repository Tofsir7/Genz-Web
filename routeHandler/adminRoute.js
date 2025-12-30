const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Student, Course } = require('../Models/Students');
const bcrypt = require('bcrypt');

// Render Dashboard
router.get('/', (req, res) => {
    // We will serve the AdminDashboard.html file
    // Ideally, we should inject data into it server-side or let it fetch via API.
    // For simplicity, we'll serve the HTML and use internal scripts to fetch data.
    const dashboard = fs.readFileSync(path.join(__dirname, '../Templates/AdminDashboard.html'), 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(dashboard);
});

// API: Get All Students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find({ role: { $ne: 'admin' } }); // Exclude admins
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Add Student (Admin)
router.post('/student', async (req, res) => {
    try {
        const { fullName, email, password, gender, course, role } = req.body;

        if (await Student.findOne({ email })) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({
            fullName,
            email,
            password: hashedPassword,
            dob: new Date(),
            gender: gender || 'other',
            course: course || 'N/A',
            role: role || 'student'
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Delete Student
router.delete('/student/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get All Courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Add Course
router.post('/course', async (req, res) => {
    try {
        const { id, courseName, courseDuration, courseFee, description, image } = req.body;

        const newCourse = new Course({
            id: id || Date.now(), // Generate rough ID if missing
            courseName,
            courseDuration,
            courseFee,
            description,
            image: image || '/images/default-course.jpg'
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course created' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Delete Course
router.delete('/course/:id', async (req, res) => {
    try {
        // Find by MongoDB Object ID
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const students = await Student.find({ role: { $ne: 'admin' } });
        const courses = await Course.find({});

        // Map course fee for easy lookup
        const courseMap = {};
        courses.forEach(c => {
            courseMap[c.courseName] = c.courseFee || 0;
        });

        // Calculate stats
        let totalEarnings = 0;
        const stats = {};

        students.forEach(s => {
            const cName = s.course;
            if (!stats[cName]) {
                const fee = courseMap[cName] || 0;
                stats[cName] = { name: cName, count: 0, earnings: 0, fee: fee };
            }
            stats[cName].count++;
            stats[cName].earnings += stats[cName].fee;
            totalEarnings += stats[cName].fee;
        });

        // Convert to array and sort by count (desc)
        const sortedStats = Object.values(stats).sort((a, b) => b.count - a.count);

        res.json({
            totalStudents: students.length,
            totalEarnings: totalEarnings,
            courseStats: sortedStats
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
