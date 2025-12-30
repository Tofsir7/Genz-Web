const fs = require('fs');
const jwt = require('jsonwebtoken');
const { Student } = require('../Models/Students');

const enrollCourseRoute = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const { course } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.redirect('/login');
        }

        student.course = course;
        await student.save();

        const welcomeCard = fs.readFileSync('Templates/welcome-card.html', "utf8");
        res.set('content-type', "text/html");
        res.send(welcomeCard);

    } catch (err) {
        console.error("Enrollment error:", err);
        res.status(500).send("An error occurred during enrollment.");
    }
}

module.exports = enrollCourseRoute;
