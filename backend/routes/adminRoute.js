const express = require('express');
const { loginAdmin, addDoctor, allDoctors, appointmentsAdmin } = require('../controllers/adminController');
const { authAdmin } = require('../middleware/auth');

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/add-doctor', authAdmin, addDoctor);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);

module.exports = adminRouter;
