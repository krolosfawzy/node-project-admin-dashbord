var express = require('express');
var multer  = require('multer');
var bodyParser = require('body-parser');
const crus=require("cors");

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var filenamenew;
var fileStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploadfile/imges');
      //'./uploads':  Folder path where the file will be created
    },
    filename: function (req, file, callback) {
        console.log(file.mimetype);
        filenamenew=Date.now() + file.originalname;
      callback(null,filenamenew);// + '-' + Date.now() + ".jpg");
      //concate date.now to differinciate is there are many files with the same name
    }
  });

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var upload = multer({ storage : fileStorage}).single('image');

app.get('/',function(req,res){
    res.sendFile(__dirname + "/Fileupload.html");
});

app.post('/upload_file',function(req,res){
  
  //call upload object created before
  upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file." +err.toString());
      }
      console.log("in method"+filenamenew);
      //res.send(filenamenew);
  });
});

app.listen(3030,()=>{
  console.log("555");
});