// const React = require("react");
// const ReactDOMServer = require('react-dom/server');
// const App = require('./path/to/your/App').default; // Adjust the path to your App component
const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const path = require('path');

connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

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

server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
})
