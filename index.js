const inquirer = require("inquirer");
const mysql = require('mysql2')
require("console.table");


// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "605291Lmtz$",
    port: 3306,
    database: "employee_db"
  }
);

// connecting the sql and db

db.connect(function (err, res) {
  if (err) console.error(err);
  toDo();
})

function toDo() {
  inquirer.prompt({
    type: "list",
    name: "choice",
    message: 'What would you like to do',
    choices: [
      'View All Employees',
      'Update Employee Role',
      "Add Employee",
      "Remove Employees",
      "Add Role",
      "End"
    ]
  }).then(function ({ choice }) {
    switch (choice) {
      case "View All Employees":
        viewEmployee();
        break;
      case "Update Employee Role":
        updateRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Remove Employees':
        removeEmployee();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'End':
        db.end()
        break;

    }
  })
}

function viewEmployee() {
  console.log("SHOW * FROM employee;");

  let query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
    ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
    ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) console.error('viewEmployee function error');
    console.table(res);

    console.log('All Employees')
    toDo();
  })
}

function updateRole() { 
  employeeArray();
}

function employeeArray() {
  console.log("Updating employee");
  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) console.error("Error updating employee role");
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));
    
    console.table(res);
    console.log("Employee updated\n")
    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Update employee role");
  var query =
    `SELECT r.id, r.title, r.salary 
  FROM role r`

  let roleChoices;

  db.query(query, function (err, res) {
    if (err) console.error("roleArray error");
    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);
    console.log("Role updated\n")
    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {
  inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with this role?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role would you like to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      var query = `UPDATE employee SET role_id = ? WHERE id = ?`
      // when finished prompting insert a new item into employeesDB
      db.query(query,
        [ answer.roleId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) console.error("promptEmployeeRole function error");

          console.table(res);
          console.log(res.affectedRows + "Updated");

          toDo();
        });
    });
}

function addEmployee() {
  console.log("Add employee\n")

  var query =
    `SELECT r.id, r.title, r.salary 
      FROM role r`

  db.query(query, function (err, res) {
    if (err) console.error("addEmployee function error");

  //   be careful with backticks, can lead to SQL injection
    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("Role to insert");

    promptInsert(roleChoices);
  });
}

function promptInsert(roleChoices) {
  inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO employee SET ?`
      // when finished prompting, insert a new item into the db with the new info
      db.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) console.error("promptInsert function error");

          console.table(res);
          console.log(res.insertedRows + "Inserted successfully\n");

          toDo();
        });
    });
}

function removeEmployee() {
  console.log("Remove employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  db.query(query, function (err, res) {
    if (err) console.error("removeEmployees function error");

  //  again be careful of SQL injection when using backticks. might be able to use .env file? may look into for future projects
    const deleteEmployees = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("Employee removed.\n");

    promptDelete(deleteEmployees);
  });
}

function promptDelete(deleteEmployees) {
  inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to remove?",
        choices: deleteEmployees
      }
    ])

    .then(function (answer) {
      var query = `DELETE FROM employee WHERE ?`;
      db.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) console.error("Error Deleting Employee");
        console.table(res);
        console.log(res.affectedRows + "Deleted\n");
        toDo();
      });
    });
}

function addRole() {
  var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

  db.query(query, function (err, res) {
    if (err) console.error("addRole function error");

    const departmentChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("Role added");

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {
  inquirer.prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Role title: "
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Role salary: "
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department: ",
        choices: departmentChoices
      },
    ])

    // may test with this.title and this.salary and this.departmentId, because -this- refers to the object
    .then(function (answer) {
      var query = `INSERT INTO role SET ?`

      db.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
      },
        function (err, res) {
          if (err) console.error("promptAddRole function error");

          console.table(res);
          console.log("Role Inserted");

          toDo();
        });
    });
}
