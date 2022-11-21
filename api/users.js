const express = require("express");
const usersRouter = express.Router();
const { getAllUsers } = require("../db");
const { getUserByUserName } = require("../db");
const { createUser } = require("../db")
const jwt = require('jsonwebtoken');




usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body)

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUserName(username);
    
    if (user && user.password == password) {
      
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET)
    console.log(process.env.JWT_SECRET)
      // create token & return to user
      console.log(token)
      res.send({ message: "you're logged in!", token: token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  const {username, password, name, location} = req.body
  try {
    const _user = await getUserByUserName(username) 
    
    if(_user) {
      next({name: 'UserExistsError',message: 'A user by that username already exists'})
    }
    const user = await createUser ({
      username,
      password,
      name,
      location,
    })
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET)
    console.log(token)
    res.send({ 
      message: "thank you for signing up",
      token 
    });
  }catch({name, message}) {
  
    next({name, message})
  }
})

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.send({
    users: [users],
  });
});

module.exports = usersRouter;

