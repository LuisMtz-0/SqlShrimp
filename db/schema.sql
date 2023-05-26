DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

-- could also use TINYTEXT with VARCHAR NULL, sets 255 character limit
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10.3) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);
-- CREATE TABLE department (
--   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   d_name VARCHAR(30) NOT NULL
-- );

-- CREATE TABLE role (
--   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(30) NOT NULL,
--   salary DECIMAL NOT NULL,
--   department_id INT
--   );

-- CREATE TABLE employee (
--   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
--   first_name VARCHAR(30) NOT NULL,
--   last_name VARCHAR(30) NOT NULL,
--   role_id INT NULL, 
--   manager_id INT NULL
--   );