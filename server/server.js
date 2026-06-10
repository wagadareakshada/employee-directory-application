const employeeRoutes = require('./routes/employeeRoutes');
// Load environment variables
require('dotenv').config();

// 1. Import packages
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');

// 2. Create express app
const app = express();

// 3. Connect to database
connectDB();

// 4. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/employees', employeeRoutes);

// 5. Routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is alive' });
});

// 6. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});