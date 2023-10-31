drop database if exists employee-tracker;
create database employee-tracker;
use employee-tracker;
create table employee (
    id int not null auto_increment primary key,
    first_name varchar(56) not null,
    last_name varchar(56) not null,
    role_id int, 
    manager_id int,
    foreign key (role_id) references role(id) on delete set null on update no action,
    foreign key (manager_id) references employee(id) on delete set null on update no action,
)
create table roles
create table department(
    id int not null auto_increment primary key,
    name varchar(56) not null
)