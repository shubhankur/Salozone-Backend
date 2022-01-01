const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'salozone-com',
  api_key: '971468552466223',
  api_secret: 'kAH5AdBEnoIwpCesrsFPnvm5ELA'
});

const app = express();

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
});

var upload = multer({ storage: storage });

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

//routes
const userRoute = require('./routes');
app.use(userRoute);

app.get('/cronjob', (req,res) => {
   res.json({msg: 'You have successfully activated the server'});
});

app.post('/upload', upload.single('image'), (req, res, next) => { 

    const data = {
        image: req.file.path
    }

    cloudinary.uploader.upload(data.image)
    .then((result)=>{
        res.status(200).send({
            message: "success",
            result
        });
    }).catch((error) => {
        res.status(500).send({
            message: "failure",
            error
        });
    });

});


//api listening on port 3001
//database connection (localhost --> salozone)
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://yv_intern:yashveer123@cluster0-zrrcv.mongodb.net/Salozone?retryWrites=true&w=majority')
//mongoose.connect('mongodb://localhost:27017/salozone', {useNewUrlParser: true,useUnifiedTopology: true}) 
.then( result => {
        app.listen(process.env.PORT || 3001);
        console.log('connected');
    })
    .catch( err => {
        console.log(err);
    });