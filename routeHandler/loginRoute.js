const fs = require('fs');
const loginRoute = (req, res) => {
  const login = fs.readFileSync("Templates/login.html", "utf8");
  res.set('content-type', "text/html");
  res.send(login);
}

module.exports = loginRoute;