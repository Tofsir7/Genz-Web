
const fs = require('fs');


const tempHome = fs.readFileSync('./Page.html', "utf8");

const homeRoute =  (req, res) => {
  res.set('Content-Type', 'text/html');
  let output = tempHome;
  let path = `"Images/GenZ-logo.png"`;
  output = output.replace(/{%logo%}/g, path);
  res.status(200).send(output);
}

module.exports = homeRoute;