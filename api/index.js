const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require('cors');

const path = require("path");
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

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
}).unless({path: ['/api/users','/api/conversations','/api/messages']});

app.use(cors());


dotenv.config();


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(verifyJwt);


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


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


function startServer() {
  mongoose
      .connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(db => {
        console.log('db connected');
        app.listen(process.env.PORT, () => {
          console.log(`Backend server is running! on " ${process.env.PORT}`);
        });
      })
      .catch(err => console.log('error connecting to db', err));
}

startServer();

