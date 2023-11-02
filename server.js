const inquirer = require("inquirer");
const Table = require("easy-table");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cool",
  database: "employee_tracker",
});

const app = async () => {
  connection.connect(async (err) => {
    if (err) {
      console.log("An error exist!");
      console.log(err.message);
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
        name: "menu",
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
        addRole();
      } else if (answer.menu === "add an employee") {
        addEmployee();
      } else if (answer.menu === "update an employee role") {
        updateEmployee();
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

const viewAllEmployees = async () => {
  connection.query(
    "SELECT e.id AS ID, e.first_name AS 'First  Name', e.last_name	AS 'Last Name', r.job_title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' FROM employee_tracker.employee AS e JOIN employee_tracker.roles AS r ON r.id = e.role_id JOIN employee_tracker.department AS d ON r.department_id = d.id JOIN employee_tracker.employee AS m ON m.id = e.manager_id",
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

const addDepartment = async () => {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartmentName",
        message: "Enter the new department name?",
      },
    ])
    .then(async (answer) => {
      connection.query(
        "INSERT INTO employee_tracker.department SET ?",
        {
          name: answer.newDepartmentName,
        },
        async (err) => {
          if (err) {
            console.log("An Error Exists!");
            console.log(err.message);
          }
          console.log("New dept has been added!");
        }
      );
      await viewAllDepartments();
    });
};

const addRole = async () => {
  let departments = [];
  connection.query(
    "SELECT * FROM employee_tracker.department",
    async (err, res) => {
      if (err) {
        console.log("An Error Exists!");
        console.log(err.message);
      }
      await res.forEach((e) => {
        departments.push(e.name);
      });
    }
  );
  await inquirer
    .prompt([
      {
        type: "input",
        name: "newTitle",
        message: "Enter the new title?",
      },
      {
        type: "input",
        name: "newRoleSalary",
        message: "Enter the new role's salary?",
      },
      {
        type: "list",
        name: "departmentName",
        message: "Select the department?",
        choices: departments,
      },
    ])
    .then(async (answer) => {
      let department;
      connection.query(
        "SELECT * FROM employee_tracker.department WHERE employee_tracker.department.name = ?",
        answer.departmentName,
        async (err, res) => {
          if (err) {
            console.log("An Error Exists!");
            console.log(err.message);
          }
          department = res;
          connection.query(
            "INSERT INTO employee_tracker.roles SET ?",
            {
              job_title: answer.newTitle,
              salary: answer.newRoleSalary,
              department_id: department[0].id,
            },
            async (err) => {
              if (err) {
                console.log("An Error Exists!");
                console.log(err.message);
              }
              console.log("New role has been added!");
            }
          );
          await viewAllRoles();
        }
      );
    });
};

const addEmployee = async () => {
  let managers = [];
  let roles = [];
  connection.query(
    "SELECT CONCAT(employee_tracker.employee.first_name, ' ', employee_tracker.employee.last_name) AS 'manager' FROM employee_tracker.employee",
    async (err, res) => {
      if (err) {
        console.log("An Error Exists!");
        console.log(err.message);
      }
      await res.forEach((e) => {
        managers.push(e.manager);
      });
    }
  );
  connection.query(
    "SELECT employee_tracker.roles.job_title FROM employee_tracker.roles",
    async (err, res) => {
      if (err) {
        console.log("An Error Exists!");
        console.log(err.message);
      }
      await res.forEach((e) => {
        roles.push(e.job_title);
      });
    }
  );
  await inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the new employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the new employee's last name:",
      },
      {
        type: "list",
        name: "title",
        message: "Select the new employee's title:",
        choices: roles,
      },
      {
        type: "list",
        name: "supervisor",
        message: "Select the the new employee's manager:",
        choices: managers,
      },
    ])
    .then(async (answer) => {
      let manager;
      let role;
      connection.query(
        "SELECT * FROM employee_tracker.employee WHERE CONCAT(employee_tracker.employee.first_name, ' ', employee_tracker.employee.last_name) = ?",
        answer.supervisor,
        async (err, res) => {
          if (err) {
            console.log("An Error Exists!");
            console.log(err.message);
          }
          manager = res;
          console.log(manager);
          connection.query(
            "SELECT * FROM employee_tracker.roles WHERE employee_tracker.roles.job_title = ?",
            answer.title,
            async (err, res) => {
              if (err) {
                console.log("An Error Exists!");
                console.log(err.message);
              }
              role = res;
              connection.query(
                "INSERT INTO employee_tracker.employee SET ?",
                {
                  first_name: answer.firstName,
                  last_name: answer.lastName,
                  role_id: role[0].id,
                  manager_id: manager[0].id,
                },
                async (err) => {
                  if (err) {
                    console.log("An Error Exists!");
                    console.log(err.message);
                  }
                  console.log("New employee has been added!");
                }
              );
              await viewAllEmployees();
            }
          );
        }
      );
    });
};

const updateEmployee = async () => {
  let employees = [];
  let roles = [];
  connection.query(
    "SELECT CONCAT(employee_tracker.employee.first_name, ' ', employee_tracker.employee.last_name) AS employee FROM employee_tracker.employee",
    async (err, res) => {
      if (err) {
        console.log("An Error Exists!");
        console.log(err.message);
      }
      await res.forEach((e) => {
        employees.push(e.employee);
      });
      connection.query(
        "SELECT employee_tracker.roles.job_title FROM employee_tracker.roles",
        async (err, res) => {
          if (err) {
            console.log("An Error Exists!");
            console.log(err.message);
          }
          await res.forEach((e) => {
            roles.push(e.job_title);
          });
        }
      );
      await inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select the employee you want to update:",
            choices: employees,
          },
          {
            name: "role",
            type: "list",
            message: "Select the new job title:",
            choices: roles,
          },
        ])
        .then(async (answers) => {
          let employee;
          let role;
          connection.query(
            "SELECT * FROM employee_tracker.employee WHERE CONCAT(employee_tracker.employee.first_name, ' ', employee_tracker.employee.last_name) = ?",
            answers.employee,
            async (err, res) => {
              if (err) {
                console.log("An Error Exists!");
                console.log(err.message);
              }
              employee = res;
              connection.query(
                "SELECT * FROM employee_tracker.roles WHERE employee_tracker.roles.job_title = ?",
                answers.role,
                async (err, res) => {
                  if (err) {
                    console.log("An Error Exists!");
                    console.log(err.message);
                  }
                  role = res;
                  connection.query(
                    "UPDATE employee_tracker.employee SET employee_tracker.employee.role_id = ? WHERE employee_tracker.employee.id = ?",
                    [role[0].id, employee[0].id],
                    async (err) => {
                      if (err) {
                        console.log("An Error Exists!");
                        console.log(err.message);
                      }

                      console.log("The employee has been updated.");
                      await viewAllEmployees();
                    }
                  );
                }
              );
            }
          );
        });
    }
  );
};

app();
