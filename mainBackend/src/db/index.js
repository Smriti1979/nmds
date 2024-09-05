import pg from 'pg'
import { app } from "../app.js";
const pool = new pg.Pool({
    user: 'postgres', // PostgreSQL user
    host: 'localhost', // Hostname of the PostgreSQL server
    database: 'postgres', // Default database or specify the database you want to connect to
    password: 'mysecretpassword', // Password for the PostgreSQL user
    port: 5432, 
  });

async function connect() {
    try {
        await pool.connect();
        
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.log(error)
        process.exit(1);
        
    }   
}

export { connect,pool };


