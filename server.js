const connection = require("./config/myconnection");
const inquirer = require("inquirer");
const table = require("easy-table");

const app = async () => {
  connection.connect(async (error) => {
    if (error) {
      console.log("An error exist!");
      console.log(error.message);
    }
    console.log("connected to database");
    await main();
  });
};

const main = async () => {
  await inquirer.prompt([
    {
        type: "list",
        name: "main-menu",
        message: "Select from the options below.",
        choices: [
            "view all departments", 
            "view all roles",
            "view all employees", 
            "add a department", 
            "add a role", 
            "add an employee", 
            "update an employee role",
            "exit app"
        ]
    }
]);
};
