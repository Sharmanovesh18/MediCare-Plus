const express = require('express');
const { registerUser, loginUser, bookAppointment, listAppointments, cancelAppointment, paymentStripe, verifyStripe, getProfile, updateProfile } = require('../controllers/userController');
const { authUser } = require('../middleware/auth');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointments);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/payment-stripe', authUser, paymentStripe);
userRouter.post('/verify-stripe', authUser, verifyStripe);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', authUser, updateProfile);

module.exports = userRouter;
