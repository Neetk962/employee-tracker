insert into department (id, name)
values
(1,"engineering"),
(2,"office-staff");

insert into roles (id, job_title, salary, department_id)
values
(1,"developer",100000,1),
(2,"admin",40000,2);

insert into employee (id, first_name, last_name, role_id, manager_id)
values
(1,"Ravneet","Kaur",1,1),
(2,"Bob","Smith",2,2);  
