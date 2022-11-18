const express = require('express')
const postsRouter = express.Router()
const {getAllPosts} = require('../db')
const { requireUser } = require('./utils');
const {createPost } = require('../db')


postsRouter.use((req,res,next) => {
    console.log("A request is being made to /posts")
    next()
})
 postsRouter.get('/', async (req, res) => {
const posts = await getAllPosts()
res.send({
    posts:[posts]
})
 })


 postsRouter.post('/', requireUser , async(req, res, next) => {
    const {title, content, tags = ""} = req.body
    const tagsArr = tags.trim().split(/\s+/)
    const postsData = {}

    if(tagsArr.length) {
        postsData.tags = tagsArr
    }
    try {   
        const post = createPost(id, title, content, tagsArr)
        postsData.authorId = post.req.user.id
        postsData.title = post.title
        postsData.content = post.content

        if (post) {
            res.send("Post Here", post)
        }
    }
    catch({name, message}) {
        console.log("There was an error doing this tag thing (Not sure what it's doing to be honest)")
        next({name, message})
    }
 })

 module.exports = postsRouter