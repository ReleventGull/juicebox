//Imports the pg module
const { Client } = require("pg"); //imports the pg module

//This gives the DB ame and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

const getAllUsers = async () => {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active           x 
         FROM users;
         `
  );
  console.log("Rows from Users", rows)
  return rows;
}; 

const createUser = async ({ username, password, name, location }) => {
  try {
    const {rows: [user]} = await client.query(
      `
        INSERT INTO users(username, password, name, location) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, password, name, location]
    );
   return user
  } catch (error) {
    throw error;
  }
};


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




module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
  };
