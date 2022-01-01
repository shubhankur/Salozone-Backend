const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
    
    const authHeader = req.get('Authorization')
    if(!authHeader){
        return res.status(401).json({ msg :'Not authenticated'});
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'supersecretkeyforsalozonewebserver');
    
    }catch(err){
        console.log(err);
    }
    if(!decodedToken){
        return res.status(401).json({ msg: 'Not Authorized' });
    }
    if( decodedToken.role !== 'admin'){
        return res.status(401).json({ msg: 'You are not Authorized to do that action'});

    }
    next();
}

exports.userAuth = (req, res, next) => {
    
    const authHeader =req.get('Authorization')
    if(!authHeader){
        return res.status(401).json({ msg :'Not authenticated'});
    } 
    const token = authHeader.split(' ')[1];
    // console.log(token)
    let decodedToken;
    try{
        decodedToken = jwt.verify(JSON.parse(token),'supersecretkeyforsalozonewebserver');
    
    }catch(err){
        console.log(err);
    }
    if(!decodedToken){
        return res.status(401).json({ msg: 'Not Authorized' });
    }
    next();
}