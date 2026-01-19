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

connectDB();
const port = process.env.PORT || 5000;


app.use(express.json({ extended: false }));
app.use(cors());

// API routes
app.use('/api', require('./routes/app.routes'));

// Serve React build as static files
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.setHeader("Access-Control-Allow-Credentials","true")
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
