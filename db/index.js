//Imports the pg module
const { Client } = require("pg"); //imports the pg module

//This gives the DB ame and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

const getAllUsers = async () => {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active      
         FROM users;
         `
  );

  return rows;
}; 

const getAllPosts = async () => {
  try {
    const {rows} = await client.query(`
    SELECT * FROM posts;
    `)
    console.log("All posts", rows)
    return rows
  }catch (error) {
    throw error
  }
}

const createUser = async ({ username, password, name, location} ) => {
  try {
    const {rows: [user]} = await client.query(
      `
        INSERT INTO users(username, password, name, location) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, password, name, location]
    )
   return user
  } catch (error) {
    throw error;
  }
};

const createPost = async({authorId, title, content}) => {
  try {
    console.log("creating posts")
    const result = await client.query(
      `
      INSERT INTO posts("authorId", title, content)
      VALUES($1, $2, $3)
      RETURNING *;
      `,
       [authorId, title, content]
    )
    return result
  }
  catch(error) {
    console.log("There was an error creating the posts!")
    throw error;
  }
}







const updateUser = async (id, fields = {}) => {
  //Build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1} `)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  console.log("Updating Users!")
  try {
    const {rows: [user]} = await client.query(
      `
            UPDATE users
            SET ${setString}
            WHERE id =  ${id}
            RETURNING *
            `,
      Object.values(fields)
    );
    return user

  } catch (error) {
    console.log("There was an error updating users!")
    throw error;
  }
};

const updatePost =   async (id, fields = {}) => {
  let setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index+1}`)
  .join(', ')
  if (setString === 0) {
    return;
  }
  console.log(Object.values(fields), "Values here")
  try {
    const {rows} = await client.query(`
    UPDATE posts
    SET ${setString}
    WHERE "authorId" = ${id}
    RETURNING * ;
    `, Object.values(fields))
    return rows
  } catch (error) {
    console.log("There was an error updating users posts!")
    throw error;
  }
}

const getPostsByUserId = async(userId) => {
  try {
    const {rows} = await client.query(`
    SELECT * FROM posts
    WHERE "authorId" = ${userId}
    `)
    console.log("User posts Here", rows )
    return rows
  }
  catch(error) {

  }
}

const getUserById = async (userId) => {
  console.log("Grabbing User by Their ID")
  try {
    const {rows} = await client.query(`
    SELECT id, username, name, location, active FROM users
    WHERE id = ${userId}
    `);
    console.log("Rows before", rows)
    if(!rows){
     return null;
    }else {
      const postResults = await getPostsByUserId(userId)
      rows[0]["posts"] = postResults
    }
    return rows
  }
  catch(error) {
    console.log("There was an error grabbing user by their ID.")
    throw error
  }
}


module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUserId,
    getUserById
    
  };
