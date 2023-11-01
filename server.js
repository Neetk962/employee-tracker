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
  connection.query("SELECT * FROM department", async (error, response) => {
    if (error) {
      console.log("An Error Exists!");
      console.log(error.message);
    }
    console.log(table.print(response));
    await main();
  });
};

const viewAllRoles = async () => {
  connection.query(
    "SELECT employee_tracker.roles.id, employee_tracker.roles.job_title, employee_tracker.roles.salary, employee_tracker.department.name AS department FROM employee_tracker.roles JOIN employee_tracker.department ON employee_tracker.roles.department_id = employee_tracker.department.id",
    async (error, response) => {
      if (error) {
        console.log("An Error Exists!");
        console.log(error.message);
      }
      console.log(table.print(response));
      await main();
    }
  );
};

