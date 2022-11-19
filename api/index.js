//JSON WEB TOKEN STUFF
const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db')
const {JWT_SECRET } = process.env

//API ROUTER REQUIRES
const apiRouter = express.Router();
const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
const { token } = require('morgan');




//JSONWEBTOKEN
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if(!auth) {
        next ()
    }else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try {
            const {id} = jwt.verify(token, JWT_SECRET)
            if (id) {
                req.user = await getUserById(id)
                next ()
            }
        }catch({name, message}) {
            next({name, message })
        }
    } else {
        next ({
            name: 'AuthoizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        })
    }
});


//All yours Routes Here
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);
//End of Routes 


apiRouter.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    })
})


module.exports = apiRouter


