//Imports the pg module
const { Client } = require('pg'); //imports the pg module

//This gives the DB ame and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');



const getAllUsers = async () => {
    const {rows} = await client.query(
        `SELECT id, username
         FROM users;
         `)
         return  rows
}

const createUser = async({username, password}) => {
    try {
        const result = await client.query(`
        INSERT INTO users(username, password) 
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password]);
      
        
    return rows
    }catch(error) {
        throw error;
    }
    }

module.exports = {
    client,
    getAllUsers,
    createUser
}

