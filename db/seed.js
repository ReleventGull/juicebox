const { client, getAllUsers, createUser, updateUser,  } = require("./index");
//Grabs client from index.js module exports

//Calls a query which drops(deletes) all tables from out database
const dropTables = async () => {
  try {
    console.log("Starting to drop tables....");
    await client.query(`
     DROP TABLE IF EXISTS posts;
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
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
      `);
    console.log("Finished creating tables!");
  } catch (error) {
    throw error; // we pass the error up to the function that calls createTables
  }
};

const createPost = async({
  authordId,
  title,
  content
  }) => {
  try {
  const result = await client.query(`
  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    "authorId" INTEGER REFERENCES users (id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    active BOOLEAN DEFAULT true
  )
  `)
  console.log("Done creating Posts!")
  console.log("Results from creating posts", result)
  }catch(error) {
    console.log("There was an error creating posts!")
    throw error;
  }
  }

const rebuildDB = async () => {
  try {
    //Connecst the client to the database
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await getAllUsers();
  } catch (error) {
    console.error(error);
    // } finally {
    //   console.log(client.end());
    // }
  }
};

async function testDB() {
  try {
    console.log("Starting to test database...");
    const users = await getAllUsers();
    console.log("Starting to Update Users!");
    const updatedUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lestervilla, KY",
    });
    console.log("Creating Post...")
    const createdPost =  await createPost(2, "Hello", "Hi There")
    console.log("Finished updating Database");
    console.log("Finished creating Post!")
    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

const createInitialUsers = async () => {
  try {
    console.log("Starting to create users...");
    await createUser({
      username: "albert",
      password: "bertie99",
      name: "Albert",
      location: "Brasil",
    });
    await createUser({
      username: "sandra",
      password: "glamgal",
      name: "Sanda",
      location: "Brasil",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
};



rebuildDB().then(testDB).catch(console.error);
// .finally(() => client.end());
