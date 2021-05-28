const express = require("express");
const app = express();
const http = require('http');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const Route = require("./routes/route");
const server = http.createServer(app);
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');


app.use(cors());

// test route
app.get('/', (req, res) => {
    res.send('Welcome to instant chat server');
});

//middleware to verify jwt token from frontend
var verifyJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://aljinteractive.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'this is a unique identifier',
    issuer: 'https://aljinteractive.us.auth0.com/',
    algorithms: ['RS256']
});

// Other middleware
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(verifyJwt);
app.use("/api", Route);


// set up error handlers
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).send(message);
})


const io = (module.exports.io = require("socket.io")(server));
const socketManager = require('./socketManager/socketManager');
io.on("connection", socketManager);


// Start server
function startServer() {
    mongoose
        .connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(db => {
            console.log('db connected');
            server.listen(process.env.PORT, () => {
                console.log(`Backend server is running! on " ${process.env.PORT}`);
            });
        })
        .catch(err => console.log('error connecting to db', err));
}

startServer();

