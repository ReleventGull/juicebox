const express = require('express')
const postsRouter = express.Router()
const { requireUser } = require('./utils');
const {getAllPosts, createPost, updatePost, getPostById} = require('../db')


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
    console.log("User ID here", req.user[0].id)
    
    if(tagsArr.length) {
        postsData.tags = tagsArr
    }
    try {
        
        postsData.authorId = req.user[0].id
        postsData.title = title
        postsData.content = content 
        const post = await createPost(postsData)
        if (post) {
            res.send(post)
        }
    }
    catch(error) {
        throw error
    }
 })

 postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params
    const { title, content, tags } = req.body

    const updateFields = {};

    if ( tags && tags.length > 0) {
        updateFields.tags = tags.trim().split(/\s+/)
    }
    if (title) {
        updateFields.title = title
    }
    if (content) {
        updateFields.content = content
    }

    try {
        let originalPost = await getPostById(postId)
        console.log('Original Post Here', originalPost)
        console.log('User ID',)

        if (originalPost.author.id === req.user[0].id) {
            const updatedPost = updatePost(postId, updateFields)
            console.log('Updated Post here', updatedPost)
            res.send(updatedPost)
        } else {
            next({
                name: "UnauthorizedUserError",
                message: "You cannot update a post that isn't yours!"
            })
        }
    }catch({name, message}) {
        next({name, message})
    }
 })

 module.exports = postsRouter




 //curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg4MjIyMDZ9.kmve2zFzJYD09ChYzFwVhMfoCjV9FZ5yWZoV7NZutwY' -H 'Content-Type: application/json' -d '{"title": "I love fish", "content": "how is this?", "tags": " #once #twice    #happy"}'
 //curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg4MjIyMDZ9.kmve2zFzJYD09ChYzFwVhMfoCjV9FZ5yWZoV7NZutwY' -H 'Content-Type: application/json' -d '{"title": "I still do not like tags", "content": "CMON! why do people use them?"}'
//UPDATE
 //curl http://localhost:3000/api/posts/1 -X PATCH -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg4MjIyMDZ9.kmve2zFzJYD09ChYzFwVhMfoCjV9FZ5yWZoV7NZutwY' -H 'Content-Type: application/json' -d '{"title": "updating my old stuff", "tags": "#oldisnewagain"}'