const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRouter = require('./routes/adminRoute');
const doctorRouter = require('./routes/doctorRoute');
const userRouter = require('./routes/userRoute');

dotenv.config();

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hospital Management API Working');
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
