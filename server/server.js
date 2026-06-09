// 1. Import packages
const express = require('express');
const cors = require('cors');

// 2. Create express app
const app = express();

// 3. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 4. Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// 5. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



















