const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Increase limit to 50mb for image/pdf base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan('common'));

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const matchesRoute = require('./routes/matches');
const connectionsRoute = require('./routes/connections');

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/matches', matchesRoute);
app.use('/api/connections', connectionsRoute);

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-matrimony';
console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.get('/', (req, res) => {
    res.send('Smart Matrimonial API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
