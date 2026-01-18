// const React = require("react");
// const ReactDOMServer = require('react-dom/server');
// const App = require('./path/to/your/App').default; // Adjust the path to your App component
require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const connectDB = require('./config/db');
var cors = require('cors');

const port = process.env.PORT || 5000;

connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

// API routes
app.use('/api', require('./routes/app.routes'));

// Serve React build as static files
app.use(express.static(path.join(__dirname, '..', 'build')));

// For any non-API route, send back React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
