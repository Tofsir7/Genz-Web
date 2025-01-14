
const http = require('http');
const url = require('url');
const fs= require('fs');
const path = require('path');
const tempHome = fs.readFileSync(path.join(__dirname, "Page.html"), 'utf8');
//const tempHome = fs.readFileSync("Page.html", 'utf8');
const server = http.createServer((req,res)=>{
  const {pathname} = url.parse(req.url,true);
  console.log(pathname);
  if(pathname==='/' || pathname==='/home'){
    res.writeHead(200, {"content-type":"text/html"});
    let output = tempHome;
    let path = `'Images/GenZ-logo.png'`
    output = output.replace(/{%logo%}/g,path);
    output = output.replace(/{%banner%}/g,"");
    res.end(output);
    console.log(req.url);
  }
  else if(pathname==='/Banner.jpg'){
    res.writeHead(200, {"content-type":"text/html"});
    // fs.readFile(path.join(__dirname, "/Images/Banner.jpg"), 'utf8', (err,data)=>{
    //   if(err)
    //     res.end("Image not found!!");
    //   else{
    //     let output = tempHome;
    //     output = tempHome.replace(/{%banner%}/g,data);
    //     res.end(output);
    //   }
    // });
    const banner =  `<img src='Images/Banner.jpg'> </img>`;
    let output= tempHome;
    output = output.replace(/{%banner%}/g, banner);
    res.end(output);
    //console.log(output);
  }
  else if (pathname === '/favicon.ico') {
    res.writeHead(204, {"content-type":  "image/jpeg"});
    res.end();
  }
  else{
    res.end("Matha Nosto");
  }
})

server.listen(9000, '127.0.0.1', ()=>{
  console.log("Runing on port number : 9000");
  console.log(__dirname);
});
