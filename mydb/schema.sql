drop database if exists employee_tracker;
create database employee_tracker;

use employee_tracker;

create table department (
    id int not null auto_increment primary key,
    name varchar(60) not null
);

create table roles (
     id int not null auto_increment primary key,
     job_title varchar(60) not null,
     salary int not null,
     department_id int,
     foreign key (department_id) references department(id) on delete set null on update no action
);

create table employee (
    id int not null auto_increment primary key,
    first_name varchar(60) not null,
    last_name varchar(60) not null,
    role_id int, 
    manager_id int,
    foreign key (role_id) references roles(id) on delete set null on update no action,
    foreign key (manager_id) references employee(id) on delete set null on update no action
);