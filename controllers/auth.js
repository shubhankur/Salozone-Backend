const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/user');


//textlocal

const textlocal = (number, otp) => {var https = require('https');
var urlencode = require('urlencode');

var msg = urlencode(`Your OTP is ${otp}.
Welcome to the Salozone family. Proceed with your booking to experience your best ever salon time with us.
Thank You.
 https://salozone.com`);
var toNumber = number;
var username = 'salozoneofficial@gmail.com';
var hash = '218f682af8688cb59f2ef191584d2e8d44c09b26e03f5d90bec0b3d7c091564d'; 
var sender = 'SALZON';
var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg ;
var options = {
  host: 'api.textlocal.in', path: '/send?' + data
};
callback = function (response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    console.log(str);
  });
}
https.request(options, callback).end();
}



// secret key for json web tokens 
// ---> "supersecretkeyforsalozonewebserver"



//SignUp controller (POST Method)
// form Feild names 
//  --> pass user id in route which you will get on successful registration of mobile number
//     for email --> email
//     for password --> password
//     for confirm password --> confirmPassword

exports.postSignUp  = async (req, res, next) => {
    const userId = req.params.id;
    const email = req.body.email;
    const address=req.body.address;
    const fullName=req.body.fullName;
    const house=req.body.house;
    const locality=req.body.locality;
    const landmark=req.body.landmark;
    const member=req.body.member;
    // const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;
    const currentUser = await User.findOne({ _id: userId });
        if(currentUser.email && currentUser.isVerified){
            currentUser.email= email?email:currentUser.email;
            currentUser.fullName=fullName?fullName:currentUser.fullName;
            currentUser.address=address?address:currentUser.address;
            currentUser.houseNo=house?house:currentUser.house;
            currentUser.locality=locality?locality:currentUser.locality;
            currentUser.landmark=landmark?landmark:currentUser.landmark;
            currentUser.member=member?member:currentUser.member;
            // currentUser.password= hashedPassword;
            const result = await currentUser.save();

            console.log('existing user')
            return res.status(201).json({user:currentUser});
        }else if(currentUser && !currentUser.isVerified){
            return res.status(409).json({ msg: "Please verify your Mobile Number then register your email"});
        }else{
            currentUser.email= email;
            currentUser.fullName=fullName;
            currentUser.address=address;
            currentUser.houseNo=house;
            currentUser.locality=locality;
            currentUser.landmark=landmark;
            currentUser.member=member;
            // currentUser.password= hashedPassword;
            const result = await currentUser.save();
            console.log(result);
            console.log('new user')
            return res.status(201).json({ status: "true", msg : "User Registered"});
        }
}

//LogIn controller (POST Method)

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const currentUser = await User.findOne({ email: email });
        if(!currentUser){
            const error = new Error('No User Found');
            error.statusCode = 401;
            throw error;
        }else{
            const passwordMatch = await bcrypt.compare(password, currentUser.password);
            if(!passwordMatch){
                const error = new Error('Wrong Password');
                error.statusCode = 401;
                throw error;
            }else{
                const token = jwt.sign({
                    email: currentUser.email,
                    userId: currentUser._id.toString()
                },
                'supersecretkeyforsalozonewebserver'
                );
                res.status(200).json({ token: token,currentUser});
            }
        }
    }
    catch(error) {
        console.log(error);
    }
}

// mobile Number Registration

exports.postMobileRegister = async (req, res, next) => {
    const mobileNumber = req.body.mobileNumber;
    try{
        const currentUser = await User.findOne({ mobileNumber: mobileNumber });
        if(currentUser && currentUser.isVerified){
            const token = speakeasy.totp({
                secret: currentUser.clientSecret,
                encoding: 'base32',
                window: 10
            });
            textlocal(`+91${currentUser.mobileNumber}`, token)

            // const response = await 
            console.log('message sent');
            return res.status(200).json({ msg: 'Message sent',userId:currentUser._id,otp: token});
            // return res.status(409).json({ msg: "Number already Registered ans Verified. Please login into your Account"});
        }
        else if( currentUser && !currentUser.isVerified){
            const token = speakeasy.totp({
                secret: currentUser.clientSecret,
                encoding: 'base32',
                window: 10
            });
            // const message = await client.messages.create({
            //     body: `OTP for Salozone Node API is ${token}`,
            //     from: twilioMobileNumber,
            //     to: `+91${currentUser.mobileNumber}`
            // });

            // textlocal.sendSMS(`+91${currentUser.mobileNumber}`, `OTP for Salozone Node API is ${token}`, 'Salozone', function (err, data) {
            //     console.log(data);
            //     console.log(err);
            // });
            textlocal(`+91${currentUser.mobileNumber}`, token)

            // const response = await 
            console.log('message sent');
            return res.status(200).json({ msg: 'Message sent',userId:currentUser._id,otp: token});
            //redirect user to '/:id/verifyotp' route to verify the OTP

        }
        else{
            const secret = speakeasy.generateSecret({ length: 20}).base32;
            const user = new User({
                mobileNumber: mobileNumber,
                clientSecret: secret
            });
            const result = await user.save();
            const token = speakeasy.totp({
                secret: secret,
                encoding: 'base32',
                window: 10
            });
            // const message = await client.messages.create({
            //     body: `OTP for Salozone Node API is ${token}`,
            //     from: twilioMobileNumber,
            //     to: `+91${mobileNumber}`
            //  });

            // textlocal.sendSMS(`+91${currentUser.mobileNumber}`, `OTP for Salozone Node API is ${token}`, 'Salozone', function (err, data) {
            //     console.log(data);
            //     console.log(err);
            // });
            textlocal(`+91${mobileNumber}`, token)
             console.log(result._id);
            return res.status(201).json({ msg: 'OTP sent. Please Verify the mobile no.', status: "Mobile number registered", userId : result._id, otp: token})

            //mobile no.added to database. redirect user to '/:id/verifyotp' route to verify OTP.

        }
    }
    catch(error) {
        console.log(error);
        }
}

// mobile number verification using otp 

exports.postOTPVerify = async (req, res, next) => {
    const userId = req.params.id;
    const otp = req.body.otp;

    try{
        
        const currentUser = await User.findOne({ _id: userId });
        if(!currentUser){

            return res.status(401).json({ msg: "Incorrect Contact Number "});
        }else{

            const verified = await speakeasy.totp.verify({
                secret: currentUser.clientSecret,
                encoding: 'base32',
                token: otp,
                window: 10
            });
            if(!verified){

                return res.status(401).json({ msg: 'OTP did not match. please try again'});
            }else{

                currentUser.isVerified = true;
                const result = await currentUser.save();
                return res.status(200).json({ msg: 'User Verified !!',user:currentUser});

                // redirect user to the route '/:id/signup' signup form to get email and password
            }
        }
        
    }
    catch(error) {
        console.log(error);
    }
}

