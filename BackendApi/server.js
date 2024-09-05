const express = require('express')
const { RateLimiterMemory } = require('rate-limiter-flexible');
const functionFromModule1 = require('./helper_utils/tokenVerifier.js');
const { createServer } = require("http");
const cookieParser = require('cookie-parser')
const db = require('./models')
const userRoutes = require('./routes/userRoutes')
const ip = require('ip');
const host = ip.address();
const cors = require('cors');
const fs = require('fs');
const userModel = require('./models/userModel.js');


const logModel = db.log;
//setting up your port
const port = process.env.PORT
//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use(cors());
app.use(cookieParser())

// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: 100000000, // Number of points
  // duration: 60 * 60, // Per 60 minutes
  duration: 60, // Per 60 seconds
});

// Middleware to check rate limit for each request
const limiterMiddleware = (req, res, next) => {

  // Use the user ID as the key for rate limiting
  const data = functionFromModule1.verifyToken(req.headers['authorization']);
  var userId = "";
  if (data == undefined) {
    userId = "";
  } else {
    userId = data.id;
  }
  // console.log('data',data);
  // console.log('userId',userId);

  var ipAddress =req.headers['x-forwarded-for'] ||  req.connection.remoteAddress; 
  const key = userId + ipAddress;

  rateLimiter.consume(key)
    .then(() => {
      registerLog(userId, ipAddress, req, "200")
      next();
    })
    .catch(() => {

      registerLog(userId, ipAddress, req, "429")
      res.status(429).send({ msg: 'Too many requests from this user, please try again later', statusCode: false });
    });

};




const registerLog = (userId, ipAddress, request, statusCode) => {

  const userLogs = new logModel({
    userId: userId,
    userIp: ipAddress,
    api: request.originalUrl,
    // requestType: '' ,
    // requestType: JSON.stringify(request.body) ,
    statusCode: statusCode
  });
  userLogs.save()
    .then((userLogs) => {
      // console.log('report',userLogs);
    })
    .catch((error) => {
      // console.log('report',error);
    });

};


// Apply the rate limiter middleware to specific routes
app.use('/api/', limiterMiddleware);





db.sequelize.sync().then(() => {
})

app.use('/api', userRoutes)
const server = createServer(app);

//listening to server connection
server.listen(port, function (error) {
  if (error) console.log("Error in server setup");
  // console.log(`Server is listening on http://${host}:${port}`);
})

app.on('close', function () {
  db.sequelize.close();
})

app.get("/", (req, res) => {
  var index = fs.readFileSync('index.html', 'utf8');
  res.writeHead(200, { 'Content-Type': 'html' });
  res.end(index);
});




