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

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUserName(username);
    console.log('user', user)
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
    console.log("Error bro")
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

// curl http://localhost:3000/api/users/register -H "Content-Type: application/json" -X POST -d '{"username": "syzyagys", "password": "stars", "name": "josiah", "location": "quebec"}'



// curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "albert", "password": "bertie99"}'
// curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg3NDQ3Nzh9.RDvtwl0b4cPcsSUKWAkRzlDicQ4Bj91Q0DiK_GDY09I'
//curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg3NDYzNDh9.fbiNhVm1wfVZCLcfecNKZg4nJgvQMz5jAZo6CHNJIes' -H 'Content-Type: application/json' -d '{"title": "test post", "content": "how is this?", "tags": " #once #twice    #happy"}'

//curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg3NDYzNDh9.fbiNhVm1wfVZCLcfecNKZg4nJgvQMz5jAZo6CHNJIes' -H 'Content-Type: application/json' -d '{"title": "test post", "content": "how is this?", "tags": " #once #twice    #happy"}'
//curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg3NDYzNDh9.fbiNhVm1wfVZCLcfecNKZg4nJgvQMz5jAZo6CHNJIes' -H 'Content-Type: application/json' -d '{"title": "I am quite frustrated"}'



