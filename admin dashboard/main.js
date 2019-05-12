const ejs=require("ejs");
const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const crus=require("cors");
const mongodb = require('mongodb');
const mongo=mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const app = express();

// var jsonParser = bodyParser.json();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//var urlencodedParser = bodyParser();//.urlencoded({ extended: true });

var imagenameurl;

app.use(express.static(__dirname + '/uploadfile'));
var fileStorage =   multer.diskStorage({
  
    destination: function (req, file, callback) {
      Console.log('des');
      callback(null, './uploadfile/images');      
    },
    filename: function (req, file, callback) {
        console.log(file.mimetype);
        Console.log('ASD');
        imagenameurl=Date.now() + file.originalname;
      callback(null,imagenameurl);
    }
  });

var upload = multer({ storage : fileStorage}).single('image');
////////////////////////////////////////////////////////////////
//connection database
var con1;
var con2;
mongo.connect(url,{useNewUrlParser: true}, (err, client) => {
    if (err) 
    {
      console.error(err)
      return;
    }

    const db = client.db('sampleE-commerce');
    const collection1 = db.collection('Category');
    const collection2 = db.collection('Products');
    con1=collection1;
    con2=collection2;
    collection2.find().toArray((err, items) => {
        console.log(items)
      });
    collection1.find().toArray((err, items) => {
    console.log(items)
  })
  });
  
  
////////////////////////////////////////////////////////////////
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//localhost:5000/admin
app.get("/admin",(req,res)=>{
    var catigory;
    var maincat;
    var matshcat=false;
    if(req.query.catigoryname!=null)
    {
        matshcat=true;
        maincat=req.query.catigoryname;
    }
     
    con1.find().toArray((err, cat)=>{
        catigory=cat;
    
    con2.find().toArray((err, pros) => {
        res.render(__dirname + "/addproductpage.ejs",{products:pros ,catigorys:catigory,maincat:maincat,matshcat:matshcat});
      });
    });
    
});
// urlencodedParser,
//http://localhost:5000/addproduct
//,upload.single('image')
app.post("/addproduct", (req,res)=>{
    console.log("in http://localhost:5000/addproduct");
    upload(req,res,function(err) 
    {
         if(err)
          {
            return res.end("Error uploading file." +err.toString());
          }
          console.log(`////////////////////////////////////////////////////////////////////////////////////`);
          console.log(req.file);
          console.log(`////////////////////////////////////////////////////////////////////////////////////`);
        //res.end("File is uploaded"+req.body.user);
        con2.insertOne({"Name":req.body.Name,"price":req.body.Price ,"image":imagenameurl,"NameCat":req.body.NameCat},(err, result) => {
          console.log(result);
          // console.log(`//////////////`);
          // console.log(res);
          //  res.end("File is uploaded");
        });
        ///var image = req.file.filename;
    console.log(req);
          return res.end("File uploaded sucessfully!.");
    });
    
  });



  //////////////////////////
  //http://localhost:5000/deletepro/:name
  app.delete("/deletepro/:name",(req,res)=>{
    con2.deleteOne({Name:req.params.name}, (err, item) => {
      console.log(item);
      
    });

  });
//////////////////////////
  //http://localhost:5000/admin/catigory
app.get("/admin/catigory",(req,res)=>{
  var catigory=[];
  var product=[];
  var arrcatigory=[];

  con1.find().toArray((err,cat)=>{
    var cati=cat;
    con2.find().toArray((err,pro)=>{
      var proo=pro;
    for(var cat of cati)
    {
      catigory.push(cat.Name);
      var num=0;
      for(var pro of proo)
      {
        if(pro.NameCat==cat.Name)
        {
          num++;
        }
      }
      product.push(num);
      arrcatigory.push({name:cat.Name,count:num})
    }
    //console.log(catigory+"///////////"+product+"////////////"+JSON.stringify(arrcatigory));
    res.render(__dirname+"/catigorypage.ejs",{arrcatigory:arrcatigory});
  });
    }); 
});

/////////////////////////////
//http://localhost:5000/addcatigory
app.post("/addcatigory",(req,res)=>{

  con1.insertOne({"Name":req.body.Name},(err, result) => {
    if(err)
    {
      console.log(err);
    }
    else
    console.log(result);
    });
});

//////////////////////////
//http://localhost:5000/deletecat/:id=
  app.delete("/deletecat/:name",(req,res)=>{
    con1.deleteOne({Name:req.params.name}, (err, item) => {
      console.log(item);
    });
    con2.deleteMany({NameCat:req.params.name}, (err, item) => {
      console.log(item);
    });
  });
  
///////////////////////////////////
//http://localhost:5000/getproduct/:Name=
app.get("/getproduct/:Name",(req,res)=>{
  con2.findOne({Name:req.params.Name},(err,item)=>{
    console.log(item);
    res.send(item);
  });
})

//////////////////////////////
//http://localhost:5000/updateproduct
app.post("/updateproduct",(req,res)=>{
  if(req.body.image==null)
  {
  con2.updateOne({Name:req.body.nameval},{$set: {Name: req.body.Name, NameCat:req.body.NameCat,price:req.body.Price}},(err,result)=>{
    console.log(result);
  });
  }
  else
  {
    con2.updateOne({Name:req.body.nameval},{$set: {Name: req.body.Name, NameCat:req.body.NameCat,image:req.body.image,price:req.body.Price}},(err,result)=>{
      console.log(result);
    });
  }
});


app.listen(5000);



/* con2.insertOne({"Name":req.body.Name,"Price":req.body.price ,"image":'',"NameCat":req.body.MameCat},
      (err, result) => {
            console.log(result);
            console.log(req.body);
          
          });*/
    ///////////
    // var form = new formidable.IncomingForm();

    // form.parse(req);

    // form.on('fileBegin', function (name, file){
    //     file.path = __dirname + '/storage/' + file.name;
    // });

    // form.on('file', function (name, file){
    //     console.log('Uploaded ' + file.name);
    // });



    //////////