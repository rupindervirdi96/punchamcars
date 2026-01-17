// const React = require("react");
// const ReactDOMServer = require('react-dom/server');
// const App = require('./path/to/your/App').default; // Adjust the path to your App component
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const connectDB = require('./config/db');
var cors = require('cors');

const port = 5000;

connectDB();

app.use(express.json({ extended: false }));
app.use(cors())

app.use('/api', require('./routes/app.routes'));

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
