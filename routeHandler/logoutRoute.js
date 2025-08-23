

const loginRoute = (req, res) => {
  res.clearCookie("token");
  
  res.redirect('/login');

}
  module.exports = loginRoute;