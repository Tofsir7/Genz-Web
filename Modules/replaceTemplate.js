module.exports = (temp, course) => {
    let output = temp.replace(/{%COURSEID%}/g, course.id);
    output = output.replace(/{%COURSENAME%}/g, course.courseName);
    output = output.replace(/{%COURSEFEE%}/g, course.courseFee);
    output = output.replace(/{%COURSEDURATION%}/g, course.courseDuration);
    output = output.replace(/{%COURSEDESCRIPTION%}/g, course.description);
    output = output.replace(/{%COURSEIMAGE%}/g, course.image);
    output = output.replace(/{%NAME%}/g, course.fullName);
    output = output.replace(/{%EMAIL%}/g, course.email);
    output = output.replace(/{%COURSE%}/g, course.course);
    return output;
}