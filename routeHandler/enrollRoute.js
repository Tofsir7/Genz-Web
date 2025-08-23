const fs = require('fs');

const enrollRoute = (req, res) => {
    const enrollForm = fs.readFileSync('Templates/Enroll-form.html', "utf8");
  res.set('content-type', "text/html");
  const output = enrollForm;
  res.send(output);
}

module.exports = enrollRoute;