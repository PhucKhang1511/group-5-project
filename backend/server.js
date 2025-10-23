const express = require('express');
const app = express();

// Middleware xử lý JSON
app.use(express.json());

// Import route
const userRoutes = require('./routes/user');

// Dùng route tại đường dẫn /api
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

