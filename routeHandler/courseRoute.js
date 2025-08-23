const fs = require('fs');
const replaceTemplate = require('../Controller/replaceTemplate');
const {Course} = require("../Models/Students")




const courseRoute =  async (req, res) => {
  try{
    const ID=req.params.id;
    const course = await Course.findOne({id:ID});
    if(!course)
    {
      return res.status(404).send("Course not found!!");
    }
    res.set('Content-Type', 'text/html');
    //READ PAGE-TEMPLATE
    const tempCourse = fs.readFileSync('./Templates/Template-course.html', "utf8");
    
    const output = replaceTemplate(tempCourse, course);
    res.send(output);
  }catch(err){
    console.log(`There is an error in reading Data: ${err}`);
  }
};

module.exports = courseRoute