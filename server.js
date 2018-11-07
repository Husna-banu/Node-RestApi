var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false});

//Api for finding the product of two numbers
router.get('/product',(req,res,next) => {
  var a = req.param('param1');
  var b = req.param('param2');
  var c = 0;
  if(a != 0 && b != 0)
    c = a * b;
  //res.send(`The product of ${a} and ${b} is ${c}`);
  res.json({"error":false,"message":"success","data":c});
})

//Api for finding non repeating character in a given string
router.get('/string',(req,res,next) => {
  var orgstr = req.param('str');
  var str = orgstr.replace(/\s/g,'');
  var arr = str.split('');
  var counter = 0;
  var result = '';
  for (var x = 0; x < arr.length; x++) {
   counter = 0;
  for (var y = 0; y < arr.length; y++) {
  if (arr[x] === arr[y]) {
    counter+= 1;
    }
   }

   if (counter < 2) {
  result = arr[x];
  break;
  }
}
 res.json({"error":false,"message":"success","data":`The first non repeating character in the string ${orgstr} is ${result}`});
})

//Api for crawling of web page
router.get('/webcrawler',(req,res,next) => {
var pageToVisit = "http://www.wipro.com";
//var pageToVisit = req.params['dom'];
var url = new URL(pageToVisit);
var baseUrl = url.protocol + "//" + url.hostname;
console.log("Visiting page " + pageToVisit);
request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   console.log("Status code: " + response.statusCode);
     if(response.statusCode === 200) {
       var $ = cheerio.load(body);
       var all_links = collectInternalLinks($,baseUrl);
       res.json({"error":false,"message":"success","data":all_links});
     }
  });
  })

  function collectInternalLinks($,baseUrl) {
  var allAbsoluteLinks = [];
  var absoluteLinks = $("a[href^='http']");
  absoluteLinks.each(function() {
      allAbsoluteLinks.push(baseUrl+$(this).attr('href'));
  });
  return allAbsoluteLinks;
}

//Api to write file content on disk
router.get('/writefile',(req,res,next) => {
  res.writeHead(200,{'Content-Type':'text/html'});
  fs.createReadStream(__dirname+'/readFileform.html').pipe(res);
  })

router.post('/writefile',urlencodedParser,(req,res,next) => {
  var text = req.body.filecont;
  var writeStream = fs.createWriteStream(__dirname+'/stuff/stufftext.txt');
  writeStream.write(text);
  res.writeHead(200,{'Content-Type':'text/html'});
  fs.createReadStream(__dirname+'/successfile.html').pipe(res);
})

app.use('/',router)
app.listen(3001);
console.log('Listening to the port 3001');
