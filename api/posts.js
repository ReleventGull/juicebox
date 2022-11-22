const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const { getAllPosts, createPost, updatePost, getPostById } = require("../db");

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");
  next();
});

postsRouter.get('/', async (req, res, next) => {
  
  try {
    const allPosts = await getAllPosts()
    
    const posts = allPosts.filter(post => post.active || (req.user && post.author.id === req.user.id))
    console.log("ALl posts here ", posts)
    res.send(posts)
  
  }catch({name,error}) {
    next({name, error})
  }
})

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const tagsArr = tags.trim().split(/\s+/);
  const postsData = {};

  if (tagsArr.length) {
    postsData.tags = tagsArr;
  }
  try {
    postsData.authorId = req.user.id;
    postsData.title = title;
    postsData.content = content;
    const post = await createPost(postsData);
    console.log("Create post", post)
    if (post) {
      res.send(post);
    }
  } catch (error) {
    throw error;
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }
  if (title) {
    updateFields.title = title;
  }
  if (content) {
    updateFields.content = content;
  }

  try {
    let originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      
      res.send(updatedPost);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that isn't yours!",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete("/:postsId", requireUser, async (req, res, next) => {
  try {
    const { postsId } = req.params;
    const post = await getPostById(postsId);
    if (post && post.author.id === req.user.id) {
      console.log(post)
      const updatedPost = await updatePost(post.id, { active: false });
      res.send({ post: updatedPost });
    } else {
      console.log("Can't do that");
      next(
        post
          ? {
              name: "UnauthorizatedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : { name: "PostNotFoundError", message: "That post does not exist" }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = postsRouter;




//curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg4MjIyMDZ9.kmve2zFzJYD09ChYzFwVhMfoCjV9FZ5yWZoV7NZutwY' -H 'Content-Type: application/json' -d '{"title": "I love fish", "content": "how is this?", "tags": " #once #twice    #happy"}'
//curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg4MjIyMDZ9.kmve2zFzJYD09ChYzFwVhMfoCjV9FZ5yWZoV7NZutwY' -H 'Content-Type: application/json' -d '{"title": "I still do not like tags", "content": "CMON! why do people use them?"}'
//UPDATE
//curl http://localhost:3000/api/posts/1 -X PATCH -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2Njg5ODQ4NjB9.I1AeDCVXiuy8ZeqiCnYyb0Gyyzp0tIR3-uaD7Ms4FBY' -H 'Content-Type: application/json' -d '{"title": "updating my old stuff", "tags": "#oldisnewagain"}'
