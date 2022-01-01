const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const userActionController = require('../controllers/userActions');
const adminController = require('../controllers/admin');

//middlewares
const auth = require('../middlewares/is-Auth');

//admin routes
router.post('/admin/signup', adminController.postAdminSignUp);
router.post('/admin/login', adminController.postAdminLogin);
router.get('/admin/services', auth.adminAuth, adminController.getServices);
router.post('/admin/services', auth.adminAuth, adminController.postServices);
router.put('/admin/services', auth.adminAuth, adminController.editServices);
router.delete('/admin/services', auth.adminAuth, adminController.deleteServices);
router.get('/admin/offers', auth.adminAuth, adminController.getOffers);
router.post('/admin/offers', auth.adminAuth, adminController.postOffers);
router.put('/admin/offers', auth.adminAuth, adminController.editOffers);
router.delete('/admin/offers', auth.adminAuth, adminController.deleteOffers);
router.get('/admin/promocodes', auth.adminAuth, adminController.getPromocodes);
router.post('/admin/promocodes', auth.adminAuth, adminController.postPromocodes);
router.put('/admin/promocodes', auth.adminAuth, adminController.editPromocodes);
router.delete('/admin/promocodes', auth.adminAuth, adminController.deletePromocodes);
router.get('/admin/deals', auth.adminAuth, adminController.getDeals);
router.post('/admin/deals', auth.adminAuth, adminController.postDeals);
router.put('/admin/deals', auth.adminAuth, adminController.editDeals);
router.delete('/admin/deals', auth.adminAuth, adminController.deleteDeals);
router.get('/admin/bookings', auth.adminAuth,adminController.getBookings);
router.get('/admin/usercombos', auth.adminAuth,adminController.getUserCombos);
router.put('/admin/usercombos', auth.adminAuth,adminController.editUserCombos);
router.get('/admin/users', auth.adminAuth,adminController.getUsers);
//employee
router.post('/admin/employee',auth.adminAuth,adminController.addEmployee)
router.get('/admin/employee',auth.adminAuth,adminController.getAllEmployee)
router.get('/admin/employee/:mobileNumber',auth.adminAuth,adminController.getEmployee)
router.delete('/admin/employee/:mobileNumber',auth.adminAuth,adminController.deleteEmployee)
router.post('/admin/employee/edit/:mobileNumber',auth.adminAuth,adminController.editEmployee)
router.post('/admin/employee/addbooking/:mobileNumber',auth.adminAuth,adminController.addBooking)
//auth routes
router.post('/:id/signup', authController.postSignUp );
router.post('/login', authController.postLogin );
router.post('/registermobile', authController.postMobileRegister );
router.post('/:id/verifyotp', authController.postOTPVerify );

//user routes
router.post('/feedback', userActionController.postFeedback );
router.post('/complaints', userActionController.postComplaints );
router.post('/join', userActionController.postJoinUs );
router.get('/services', userActionController.getServices);
router.get('/servicesnames', userActionController.getServicesNames);
router.get('/booking',  userActionController.getBookings );
router.post('/booking',  userActionController.postBooking);
router.put('/booking',  userActionController.editBooking);
router.delete('/booking',  userActionController.deleteBooking);
router.get('/offers', userActionController.getOffers);
router.get('/promocodes', userActionController.getPromocodes);
router.get('/deals', userActionController.getDeals);
router.get('/usercombos', userActionController.getUserCombos);
router.post('/usercombos',  userActionController.postUserCombos);
router.delete('/usercombos',  userActionController.deleteUserCombos);
router.get('/allusercombos', userActionController.getAllUserCombos);

router.post('/payment', userActionController.payment);
router.post('/paymentsuccess', userActionController.paymentSuccess);

module.exports = router;