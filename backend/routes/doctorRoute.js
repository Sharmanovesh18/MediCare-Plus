const express = require('express');
const { doctorList, doctorAppointments } = require('../controllers/doctorController');
const { authDoctor } = require('../middleware/auth');

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.get('/appointments', authDoctor, doctorAppointments);

module.exports = doctorRouter;
