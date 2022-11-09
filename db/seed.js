const { client, 
        getAllUsers,
        createUser 
} = require("./index");
//Grabs client from index.js module exports

//Calls a query which drops(deletes) all tables from out database
const dropTables = async () => {
  try {
    console.log("Starting to drop tables....");
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error(error);
  }
};
//Will create all the tables for our database
const createTables = async () => {
  try {
    console.log("Creating Tables...");
    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
      `);
    console.log("Finished creating tables!");
  } catch (error) {
    throw error; // we pass the error up to the function that calls createTables
  }
};

const rebuildDB = async () => {
  try {
    //Connecst the client to the database
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
   
    console.log(result)
  } catch (error) {
    console.error(error);
  } finally {
    console.log(client.end());
  }
};

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

const createInitialUsers = async() => {
try {
    console.log("Starting to create users...")
    const albert = await createUser({username:'albert', password: 'bertie99'})
    const albertTwo = await createUser({username: 'albert', password: 'imposter_albert'})
    console.log(albert)
    console.log('Finished creating users!')
}catch(error) {
    console.error('Error creating users!')
    throw error;
}

}



rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());

