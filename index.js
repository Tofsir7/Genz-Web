
const http = require('http');
const url = require('url');
const fs= require('fs');
const path = require('path');
const replaceTemplate = require('./Modules/replaceTemplate');
const tempHome = fs.readFileSync(path.join(__dirname, "Page.html"), 'utf8');
const tempCourse= fs.readFileSync(path.join(__dirname, "Templates/Template-course.html"), 'utf8');
const data = fs.readFileSync('Dev-data/data.json')
const enrollForm = fs.readFileSync(path.join(__dirname, "Templates/Enroll-form.html"),'utf8');
const dataObject = JSON.parse(data);
//const tempHome = fs.readFileSync("Page.html", 'utf8');
const server = http.createServer((req,res)=>{
  const {query, pathname} = url.parse(req.url,true);
  //console.log(query);

  //home page
  if(pathname==='/' || pathname==='/home'){
    res.writeHead(200, {"content-type":"text/html"});
    let output = tempHome;
    let path = `"https://raw.githubusercontent.com/Tofsir7/Genz-Web/refs/heads/master/Images/GenZ-logo.png"`;
    output = output.replace(/{%logo%}/g,path);
    output = output.replace(/{%banner%}/g,"");
    res.write(output);
    //console.log(req.url);
  }

  // course overview page
  else if(pathname==='/Banner.jpg'){
    res.writeHead(200, {"content-type":"text/html"});
    const banner =  `<img src='Images/Banner.jpg'> </img>`;
    let output= tempHome;
    output = output.replace(/{%banner%}/g, banner);
    res.write(output);
  }


  else if (pathname === '/favicon.ico') {
    res.writeHead(204, {"content-type":  "text/html"});
    res.write("This is default");
  }


  //course details page
  else if(pathname==='/course'){
    res.writeHead(200, {"content-type":  "text/html"});
    const coursePage = dataObject.map(el=>replaceTemplate(tempCourse,el)).join('');
    const course = dataObject[query.id];
    const output = replaceTemplate(tempCourse,course)
    //console.log();
    res.write(output);
  }
  
  //Enroll form

  if(pathname==='/enroll'){
    res.writeHead(200, {"content-type":  "text/html"});
    const output = enrollForm;
    res.write(output);
  }

  //API page
  else if (pathname === '/api') {

    res.writeHead(200, { 'content-type': 'application/json' });
    
    res.write(data);
    //res.write('API call');
}
  else{
    //res.write("Matha Nosto");
  }
  res.end();
  //console.log(query);
})

server.listen(9000, '127.0.0.1', ()=>{
  console.log("Runing on port number : 9000");
  //console.log(__dirname);
});
