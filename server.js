const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

connectDB();

// Middleware FIRST
app.use(express.json());
app.use(cors({
  origin: 'https://punchamcars.ca',
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// API routes
app.use('/api', require('./routes/app.routes'));

// React build (prod only)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // IMPORTANT: don't hijack /api
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
