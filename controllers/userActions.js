const crypto = require('crypto');
const uniqid = require('uniqid');
var nodemailer = require('nodemailer');
const Feedback = require('../models/feedback');
const JoinUsRequests = require('../models/JoinUs');
const Services = require('../models/services');
const Booking = require('../models/bookings');
const User = require('../models/user');
const Offers = require('../models/offers');
const Promocodes = require('../models/promocodes');
const Deals = require('../models/deals');
const UserMadeCombos = require('../models/userMadeCombos');

//textlocal 
const textlocal = (name, serviceId,  number) => {
    // console.log(number);
    // console.log(name);
    // console.log(serviceId);
    var https = require('https');
    var urlencode = require('urlencode');
//     var msg = urlencode(`Your OTP is 8989.
// Welcome to the Salozone family. Proceed with your booking to experience your best ever salon time with us.
// Thank You.
//  https://salozone.com`);
    // var msg = urlencode(`Hey, ${name}. Your service has been booked. Regards, Salozone Home Salon Services.`);
    var msg = urlencode(`Hey, ${name}.%nYour service has been booked. Reach us anytime on +91 89250 70790 or contact@salozone.com.%nThanks for trusting us.%nRegards,%nSalozone Home Salon Services.%nhttps://salozone.com`);
    //  console.log(msg)
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

//textlocal 
const textlocal1 = (name, serviceId,  number,address,amount,bookingdate,bookingtime,servicesid,paymentmode,email,googlemapslink) => {
    // var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salozonebooking@gmail.com',
    pass: 'Salozonebooking@123!'
  }
});
// console.log(servicesid)
// console.log(servicesid.length)
var serviceids=JSON.stringify(servicesid)

var x=''
for(let i=0;i<servicesid.length;i++){
    x+=`<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;">${servicesid[i].name}</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">${servicesid[i].cost}</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">${servicesid[i].quantity}</td></tr>`
}
var output=`<body style="background-image: linear-gradient(to bottom right, gold , gold); padding:10px; width: 90%; margin: 0 auto;">
<h1 style="text-align: center;">Salozone</h1>
<h3 style="text-align: center;">Home Salon</h3>
<img src="cid:image1@johnson.com" style="width: 100%; height:30vh;"/>
<h3 style="text-align: center;">Booking Confirmation</h3>
<h2>Dear ${name},</h2>
<h4>Booking confirmation details are given below:</h4>
<p>Hey ${name}, Your order has been successfully placed. We assure your best ever on-time salon experience. If you get any issues after the service just send a complaint, We are always there for you. Reach us anytime on <a href="tel:8925070790" title="Book Through">+918925070790</a> or contact@salozone.com</p>
<table style="margin: 0 auto; border: 2px solid black; width: 90%;">
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;">Service Name</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Price</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Quantity</td></tr>
${x}
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;"></td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Sub Total:</td><td style="border:2px solid black;padding: 10px;font-size:15px;">${amount}</td></tr>
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;"></td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Delivery Charges:</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">0</td></tr>
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;"></td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Gross Total:</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">${amount}</td></tr>
</table>
<p>Thank You For Trusting Us</p>
<p><b>Salozone Home Salon Services</b></p>
</body>`

var output1=`<body style="background-image: linear-gradient(to bottom right, gold , gold); padding:10px; width: 90%; margin: 0 auto;">
<h1 style="text-align: center;">Salozone</h1>
<h3 style="text-align: center;">Home Salon</h3>
<img src="cid:image1@johnson.com" style="width: 100%; height:30vh;"/>
<h3 style="text-align: center;">Booking Confirmation</h3>
<h2>Dear Salozone,</h2>
<p>Hey Admin, He/She ${name}, Contact No:${number}, Email-Id:${email}, Order-Date:${bookingdate}, Order-Time:${bookingtime}, Payment-Type:${paymentmode}, Address:${address} Google-Link=${googlemapslink} order has been successfully placed. Order details are given below:
<table style="margin: 0 auto; border: 2px solid black; width: 90%;">
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;">Service Name</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Price</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Quantity</td></tr>
${x}
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;"></td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Sub Total:</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">${amount}</td></tr>
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;"></td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Delivery Charges:</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">0</td></tr>
<tr><td style="border:2px solid black;padding: 10px;font-size: 15px;"></td><td style="border:2px solid black;padding: 10px;font-size: 15px;">Gross Total:</td><td style="border:2px solid black;padding: 10px;font-size: 15px;">${amount}</td></tr>
</table>
<p><b>Salozone Home Salon Services</b></p>
</body>`
console.log(x)
var mailOptions = {
  from: 'salozonebooking@gmail.com',
  to: 'salozoneofficial@gmail.com',
  subject: 'Booking Confirmation',
  html:output1,
  attachments:[{
    filename : 'logobw2.png',
    path: './images/logobw2.png',
    cid : 'image1@johnson.com'
}]
};
var mailOptions1 = {
    from: 'salozonebooking@gmail.com',
    to: email,
    subject: 'Booking Confirmation',
    html:output,
    attachments:[{
        filename : 'logobw2.png',
        path: './images/logobw2.png',
        cid : 'image1@johnson.com'
    }]
  };

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
transporter.sendMail(mailOptions1, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

//payumoney test credentials
const merchantKey = 'zpcPF9e8';
const merchantSalt = 'yPny25lkcE';


exports.postFeedback = async (req, res, next) => {
    const fullName = req.body.fullName;
    const contactNumber = req.body.contactNumber;
    const type = 'feedback';
    const ratings = req.body.ratings;
    const content = req.body.content;
    const userId = req.query.userId

    try{
        const currentFeedback = await Feedback.findOne({
              contactNumber : contactNumber,
              content: content,
              fullName: fullName,
              type: 'feedback'
             });
        if(currentFeedback){
            return res.status(401).json({ msg: 'Feedback already submitted'});
        }
        const currentUser = await User.findOne({ _id: userId});
        const feedback = new Feedback({
            fullName: fullName,
            contactNumber: contactNumber,
            type: type,
            ratings: ratings,
            content: content
        });
    
        const result = await feedback.save();
        return res.status(201).json({ msg: 'feedback successfully submited !!'})

    }
    catch(error){
        console.log(error);
    }
}

exports.postComplaints = async (req, res, next) => {
    const fullName = req.body.fullName;
    const contactNumber = req.body.contactNumber;
    const type = req.body.type;
    const complaintType = req.body.complaintType;
    const content = req.body.content;

    try{
        const currentFeedback = await Feedback.findOne({
            contactNumber : contactNumber,
            content: content,
            fullName: fullName,
            type: type,
            complaintType: complaintType
            });
        if(currentFeedback){
            return res.status(401).json({ msg: 'Complaint/Suggestion already submitted'});
        }
        const feedback = new Feedback({
            fullName: fullName,
            contactNumber: contactNumber,
            type: type,
            complaintType: complaintType,
            content: content
        });

        const result = await feedback.save();
        return res.status(201).json({ msg: 'Complaint/Suggestion successfully submited !!'})

    }
    catch(error){
        console.log(error);
    }


}

exports.postJoinUs = async (req, res, next) => {
    const fullName = req.body.fullName;
    const contactNumber = req.body.contactNumber;
    const experience = req.body.experience;
    const about = req.body.about;
    const whyWeHire = req.body.whyWeHire;

    try{
        const currentMember = await JoinUsRequests.findOne({
            contactNumber : contactNumber
            });
        if(currentMember){
            return res.status(401).json({ msg: 'You have already applied for this.'});
        }
        const joinUsRequest = new JoinUsRequests({
            fullName: fullName,
            contactNumber: contactNumber,
            experience: experience,
            about: about,
            whyWeHire: whyWeHire
        });
        const result = await joinUsRequest.save()
        return res.status(201).json({ msg: 'Your Request for joining our team is successfully submited !!'})
    }catch(error){
        console.log(error);
    }
}


//get services
//use content type as formData, this will not work on application/json
exports.getServices = async (req, res, next) => {
    console.log(req.query)
    let type;
    if(req.query.type){
        type = req.query.type;
    }
    try{

        if(type){
            const response = await Services.find({ type: type});
            if(!response){
                res.status(500).json({ msg: 'No service found with this type'})
            }
            return res.status(200).json(response);
        }
        const response = await Services.find();
        if(!response){
            res.status(500).json({ msg: 'Server Error, Please try again after some time'})
        }
        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}

exports.getServicesNames = async (req, res, next) => {
    try{
            const servicesnames = await Services.find();
            if(!servicesnames){
                res.status(500).json({ msg: 'No service found.'})
            }
            return res.status(200).json(servicesnames);
    }
    catch(err){
        console.log(err);
    }
}

exports.postBooking = async (req, res, next) => {
    const bookingId = req.body.bookingId ? req.body.bookingId : uniqid('SER-');
    const bookingDate = req.body.bookingDate;
    const bookingTime = req.body.bookingTime;
    const bookingAddress = req.body.bookingAddress;
    const userComment = req.body.userComment;
    const paymentStatus = req.body.paymentStatus;
    const paymentMode = req.body.paymentMode;
    const totalAmount = req.body.totalAmount;
	const mihpayid = req.body.mihpayid;
    const productInfo = req.body.productInfo;
	const userName = req.body.userName;
    const services = req.body.services;
    const hash = req.body.hash;
    const user = req.query.userId;
    const emailid=req.body.emailid;
    const googlemapslink=req.body.googlemapslink;
    try{
        const currentUser = await User.findOne({ _id: user});
        if(!currentUser){
            return res.status(401).json({ msg: 'user not found'});
        }

        const phone = parseInt(currentUser.mobileNumber)

        /*const currentBooking = await Booking.findOne({
            bookingDate: bookingDate,
            bookingTime: bookingTime,
            bookingAddress: bookingAddress,
            user: user
        });

        if(currentBooking){
            return res.status(401).json({ msg: 'you have already Booked this Service, try editing it'})
        }*/

        // if(hash){
        //     const keyString =  	merchantKey+'|'+bookingId+'|'+totalAmount+'|'+productInfo+'|'+userName+'|'+currentUser.email+'|||||'+phone+'|||||';
        //     const keyArray 	= 	keyString.split('|');
        //     const reverseKeyArray = 	keyArray.reverse();
        //     const reverseKeyString =	merchantSalt+'|'+paymentStatus+'|'+reverseKeyArray.join('|');

        //     const cryp = crypto.createHash('sha512');	
        //     cryp.update(reverseKeyString);
        //     const calchash = cryp.digest('hex');

        //     if(calchash !== hash){
        //         return res.status(409).json({ msg: "Hash not verified, Transaction Failed"})
        //     }
        // }

        const booking = new Booking({
            bookingId: bookingId,
            bookingDate: bookingDate,
            bookingTime: bookingTime,
            bookingAddress: bookingAddress,
            userComment: userComment,
            paymentStatus: paymentStatus,
            paymentMode: paymentMode,
            totalAmount: totalAmount,
            mihpayid: mihpayid,
            services: services,
            user: user
        });
        const result = await booking.save();

        // console.log(userName)
        // console.log(bookingId)
        // console.log(phone)
        textlocal(userName, bookingId, `+91${phone}`);
        textlocal1(userName, bookingId, `+91${phone}`,bookingAddress,totalAmount,bookingDate,bookingTime,services,paymentMode,emailid,googlemapslink);

        console.log('booked')

        return res.status(200).json({ msg: 'Booking Successful !!!', bookingId: bookingId})
    }
    catch(err){
        console.log(err);
    }
}

exports.getBookings = async (req, res, next) => {
    const userId = req.query.userId;

    try{
        const response = await Booking.find({ user: { _id : userId }})
        if(!response){
            return res.status(409).json({ msg: 'You have not booked any service yet'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}

exports.getUserCombos = async (req, res, next) => {
    const userId = req.query.userId;

    try{
        const response = await UserMadeCombos.find({ user: { _id : userId }})
        if(response.length===0){
            return res.status(409).json({ msg: 'You have not made any combo yet'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}

exports.postUserCombos = async (req, res, next) => {
    const totalAmount = req.body.totalAmount;
    const services = req.body.services;
    const user = req.query.userId;
    const createdAt = req.body.createdAt;
    const id = req.body.id;
    try{
        const currentUser = await User.findOne({ _id: user});
        if(!currentUser){
            return res.status(401).json({ msg: 'user not found'});
        }

        const userMadeCombos = new UserMadeCombos({
            totalAmount: totalAmount,
            services: services,
            user: user,
            createdAt: createdAt,
            id: id
        });
        const result = await userMadeCombos.save();
        return res.status(200).json({ msg: 'Combo Saved Successful !!!'})
    }
    catch(err){
        console.log(err);
    }
}

exports.deleteUserCombos = async (req,res,next) => {
    const userMadeCombosId = req.query.userMadeCombosId;

    const currentUserMadeCombo = await UserMadeCombos.findOne({ _id: userMadeCombosId });
    if(!currentUserMadeCombo){
        return res.status(409).json({ msg: 'No Combo found'});
    }
    const response = await UserMadeCombos.findOneAndDelete({ _id: userMadeCombosId });
    res.status(200).json({
        msg: 'Combo deleted'
    });
}

exports.editBooking = async (req, res, next) => {
    const bookingId = req.query.bookingId;
    const newBookingDate = req.body.bookingDate;
    const newBookingTime = req.body.bookingTime;
    const newBookingAddress = req.body.bookingAddress;
    const newUserComment = req.body.userComment;
    const newPaymentStatus = req.body.paymentStatus;

    try{
        const currentBooking = await Booking.findOne({ _id: bookingId });
        if(!currentBooking){
            return res.status(409).json({ msg: 'No Booking found'})
        }
        // console.log(currentBooking)

        currentBooking.bookingDate = newBookingDate ? newBookingDate : currentBooking.bookingDate;
        currentBooking.bookingTime = newBookingTime ? newBookingTime : currentBooking.bookingTime;
        currentBooking.bookingAddress = newBookingAddress ? newBookingAddress : currentBooking.bookingAddress;
        currentBooking.userComment = newUserComment ? newUserComment : currentBooking.userComment;
        currentBooking.paymentStatus = newPaymentStatus ? newPaymentStatus : currentBooking.paymentStatus;

        

        const response = await currentBooking.save();
        return res.status(200).json(response)

    }
    catch(err){
        console.log(err);
    }
}

exports.deleteBooking = async (req,res,next) => {
    const bookingId = req.query.bookingId;

    const currentBooking = await Booking.findOne({ _id: bookingId });
    if(!currentBooking){
        return res.status(409).json({ msg: 'No Booking found'});
    }
    const response = await Booking.findOneAndDelete({ _id: bookingId });
    res.status(200).json({
        msg: 'Booking Cancelled'
    });
}


//payment route
exports.payment = async (req, res, next) => {
    const userId = req.query.userId;
    const bookingId = uniqid('SER-');
    const totalAmount = req.body.amount;
    const productInfo = req.body.productInfo;
    const userName = req.body.name;
    const email = req.body.email;

    
    const currentUser = await User.findOne({ _id: userId});
    if(!currentUser){
        return res.status(401).json({ msg: 'user not found'});
    }

    // const phone = parseInt(currentUser.mobileNumber)

    const data ={
        key: merchantKey,
        salt: merchantSalt,
        txnid: bookingId,
        pinfo: productInfo,
        fname: userName,
        email: email,
        udf5: 'BOLT_KIT_NODE_JS',
        amount: totalAmount
    }

    let cryp = crypto.createHash('sha512');
    let text = data.key+'|'+data.txnid+'|'+data.amount+'|'+data.pinfo+'|'+data.fname+'|'+data.email+'|||||'+data.udf5+'||||||'+data.salt;
    cryp.update(text);
    let hash = cryp.digest('hex');

    res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(201).json({ hash: hash, bookingId: bookingId});
}

exports.paymentSuccess = async (req, res, next) => {
    const key = req.body.key;
	const salt = req.body.salt;
	const txnid = req.body.txnid;
	const amount = req.body.amount;
	const productinfo = req.body.productinfo;
	const firstname = req.body.firstname;
	const email = req.body.email;
	const udf5 = req.body.udf5;
	const mihpayid = req.body.mihpayid;
	const status = req.body.status;
	const resphash = req.body.hash;
	
	const keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
	const keyArray 		= 	keyString.split('|');
	const reverseKeyArray	= 	keyArray.reverse();
	const reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');
	
	let cryp = crypto.createHash('sha512');	
	cryp.update(reverseKeyString);
	let calchash = cryp.digest('hex');
	
	const msg = 'Payment failed for Hash not verified...';
	if(calchash == resphash)
        msg = 'Transaction Successful and Hash Verified...';
        
    res.status(200).json({ msg: msg});
}

//get offers
exports.getOffers = async (req, res) => {
    let name;
    if(req.query.name){
        name= req.query.name
    }

    try{
        if(name){
            const response = await Offers.findOne({ name: name });
            if(!response){
                return res.status(409).json({ msg: 'No Offer found with that name'})
            }
            return res.status(200).json({response: response})
        }
        const response = await Offers.find();

        if(!response){
            return res.status(409).json({ msg: 'No Offer found with that name'})
        }

        return res.status(200).json({response: response})

    }catch(err){
        console.log(err);
    }
}

// get promocodes
exports.getPromocodes = async (req, res) => {
    try{
        const response = await Promocodes.find();
        if(!response){
            return res.status(409).json({ msg: 'No promocode found'})
        }
        return res.status(200).json({response: response})
    }catch(err){
        console.log(err);
    }
}

// get deals
exports.getDeals = async (req, res) => {
    try{
        const response = await Deals.find();
        if(!response){
            return res.status(409).json({ msg: 'No deal found'})
        }
        return res.status(200).json({response: response})
    }catch(err){
        console.log(err);
    }
}

exports.getAllUserCombos = async (req, res) => {

    try{
        const response = await UserMadeCombos.find()
        if(!response){
            return res.status(409).json({ msg: 'No combo has been made yet'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}