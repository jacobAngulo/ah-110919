const express = require("express");

const server = express();

const UserRouter = require("./users/userRouter");

server.use(express.json());
server.use(logger);
server.use("/users", UserRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log({
    method: req.method,
    requestUrl: req.url,
    timestamp: Date.now()
  });
  next();
}

module.exports = server;
