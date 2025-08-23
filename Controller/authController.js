const jwt = require('jsonwebtoken');
const fs = require('fs');
const replaceTemplate = require('../Controller/replaceTemplate')
const {Student} = require('../Models/Students');

const authentication =  (req,res)=>{
    
    const token = req.cookies.token;
    if(!token)
    {
        return res.redirect('/login');
    }
    jwt.verify(token, process.env.JWT_SECRET,async (err,user)=>{
        if(err)
        {
            return res.redirect('/login');
        }
        res.user = user;
        
        const filter = user.email;
        const studentInfo = await Student.findOne({email:filter});
        
        const profile = fs.readFileSync("Templates/profile.html", "utf8");
        let output = replaceTemplate(profile, studentInfo);
        // res.set('content-type', "text/html");
        return res.send(output);
    })
    //next();
}

module.exports = authentication;



























// exports.signup = async (req, res, next) => {
//     try {
        
//         const newUser = await User.create ({
//             username: req.body.username,
//             email: req.body.email,
//             password: await bcrypt.hash(req.body.password, 10),
//         });
//         console.log('New user created:', newUser);
//         const token = jwt.sign(
//             { userId: newUser._id },
//             process.env.JWT_SECRET,
//             { expiresIn: process.env.JWT_EXPIRES_IN }
//         );
        
//         return res.status(201).json({
//             message: 'User created successfully',
//             status: "success",
//             token: token,
//             data: {
//                 user: {
//                     id: newUser._id,
//                     username: newUser.username,
//                     email: newUser.email
//                 }
//             }
//         });
//        // console.log('This is middleware passign token');
//     }catch (error) {
//         //console.log('This is middleware passign error token');
//         return res.status(500).json({
//             message: 'Error creating user',
//             status: "fail",
//             error: error.message
//         });
//     }
//     next();
// }

// exports.middleware = (req, res, next) => {
//   // Your auth logic here
//   // For now, just call next() to allow all requests through
//   next();
// };