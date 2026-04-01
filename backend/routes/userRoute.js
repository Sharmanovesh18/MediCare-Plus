const express = require('express');
const { registerUser, loginUser, bookAppointment, listAppointments, cancelAppointment } = require('../controllers/userController');
const { authUser } = require('../middleware/auth');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointments);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);

module.exports = userRouter;
