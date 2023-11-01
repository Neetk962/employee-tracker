const inquirer = require("inquirer");
const Table = require("easy-table");
const mysql = require("mysql2"); 


const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password:"cool",
        database:"employee_tracker"

    }
)

const app = async () => {
  connection.connect(async (err) => {
    if (err) {
      console.log("An error exist!");
      console.log(err.message);
    };
    console.log("connected to database");
    await main();
  });
};

const main = async () => {
  await inquirer
    .prompt([
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
          "exit app",
        ],
      },
    ])
    .then(async (answer) => {
      if (answer.menu === "view all departments") {
        viewAllDepartments();
      } else if (answer.menu === "view all roles") {
        viewAllRoles();
      } else if (answer.menu === "view all employees") {
        viewAllEmployees();
      } else if (answer.menu === "add a department") {
        addDepartment();
      } else if (answer.menu === "add a role") {
        AddRole();
      } else if (answer.menu === "add an employee") {
        AddEmployee();
      } else if (answer.menu === "update an employee role") {
        UpdateEmployee();
      } else if (answer.menu === "exit app") {
        console.log("goodbye!");
        connection.end();
      }
    });
};

const viewAllDepartments = async () => {
  connection.query("SELECT * FROM department", async (err, res) => {
    if (err) {
      console.log("An Error Exists!");
      console.log(err.message);
    }
    console.log(Table.print(res));
    await main();
  });
};

const viewAllRoles = async () => {
  connection.query(
    "SELECT employee_tracker.roles.id, employee_tracker.roles.job_title, employee_tracker.roles.salary, employee_tracker.department.name AS department FROM employee_tracker.roles JOIN employee_tracker.department ON employee_tracker.roles.department_id = employee_tracker.department.id",
    async (err, res) => {
      if (err) {
        console.log("An Error Exists!");
        console.log(err.message);
      }
      console.log(res);
      console.log(Table.print(res));
      await main();
    }
  );
};

app();
