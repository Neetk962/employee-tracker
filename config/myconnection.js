const mysql = require("mysql2"); 


const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password:"cool",
        database:"employee_tracker"

    }
)
module.export = connection;