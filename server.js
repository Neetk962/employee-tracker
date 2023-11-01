const connection = require("./config/myconnection");
const inquirer = require("inquirer");
const table = require("easy-table");



const app = async () => {
    connection.connect(async (error) => {
        if (error) {
            console.log("An error exist!");
            console.log(error.message);
        };
        console.log("connected to database");
        await main(); 
    })
};


const main = async () => {
    await inquirer.prompt([{

    }])
}