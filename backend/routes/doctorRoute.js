const express = require('express');
const { doctorList, doctorAppointments, getBookedSlots } = require('../controllers/doctorController');
const { authDoctor } = require('../middleware/auth');

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.get('/appointments', authDoctor, doctorAppointments);
doctorRouter.get('/booked-slots/:docId', getBookedSlots);

module.exports = doctorRouter;

