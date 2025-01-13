
const http = require('http');
const url = require('url');
const fs= require('fs');
const tempHome = fs.readFileSync("Page.html", 'utf8');
const server = http.createServer((req,res)=>{
  const {query,pathname} = url.parse(req.url,true);
  console.log(pathname);
  if(pathname==='/' || pathname==='/home'){
    res.writeHead(200, {"content-type":"text/html"});
    const output = tempHome;
    const path = "Images\\GenZ logo.png"
    output = output.replace(/{%logo%}/g,path);
    res.end(output);
    console.log(output);
  }
  else if(pathname==='/Banner.jpg'){
    const banner =  `<img src="${__dirname}\\Images\\Banner.jpg" id="place"> </img>`;
    output= tempHome;
    output = output.replace(/{%banner%}/g, banner);
    res.end(output);
    //console.log(output);
  }
  else if (pathname === '/favicon.ico') {
    res.writeHead(204);
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
