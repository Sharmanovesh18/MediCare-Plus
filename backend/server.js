const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ override: true });

const adminRouter = require('./routes/adminRoute');
const doctorRouter = require('./routes/doctorRoute');
const userRouter = require('./routes/userRoute');

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

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
}

module.exports = app;
