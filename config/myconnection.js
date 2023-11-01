const mysql2 = require("mysql2"); 


const connection = mysql2.createConnection(
    {
        host: localhost:3306,
        user: "root",
        password:"cool",
        database:"employee_tracker"

    }
)
module.export = connection;