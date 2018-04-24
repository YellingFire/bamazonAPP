//Initiate mysql node package
const mysql = require("mysql");
//Initiate inquirer node package
const inquirer = require("inquirer");
//Establish connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  //Username
  user: "root",

  //Password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runManager();
});

function runManager() {
    inquirer
    .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Products for sale",
            "View Low Inventory",
            "Add Inventory",
            "Add New Product"
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View Products for sale":
            viewProducts();
            break;

            case "View Low Inventory":
            lowInven();
            break;

            case "Add Inventory":
            //Function to addInventory();
            addInventory();
            break;

            case "Add New Product":
            break;
            //Function newProduct();
        }
    })
}//END of runManager();

//Function for viewProducts();
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
      res.map(info => {
          let productInfo = {
              id: info.id,
              Product_name: info.product_name,
              Department: info.department_name,
              Price: "$" + info.price,
              Stock_quantity: info.stock_quantity
          };
          let displayInfo = "id# " + productInfo.id + " Product: " + productInfo.Product_name + " Price: " + productInfo.Price;
          console.log(displayInfo);
          });  
      });
};//END of viewProducts();

//Function for viewing lowInven();
function lowInven() {
    connection.query("SELECT * FROM bamazon_db.products WHERE stock_quantity < 20;", function(err, res) {
        if (err) throw err;
        res.map(info => {
            let productInfo = {
                id: info.id,
                Product_name: info.product_name,
                Department: info.department_name,
                Price: "$" + info.price,
                Stock_quantity: info.stock_quantity
            };
            let displayInfo = "id# " + productInfo.id + " Product: " + productInfo.Product_name + " Inventory: " + productInfo.Stock_quantity;
        console.log(displayInfo);
        });
        setTimeout(function() {
            runManager();
        }, 2000);
    });//END of connection function
};//END of lowInven()

//Function to addInventory();
function addInventory() {
    viewProducts();
    inquirer
    .prompt({
        name: "id",
        type: "input",
        message: "Please enter the item number of the product you would like increase inventory."
    })
    .then(function(answer) {
        let query = "SELECT * FROM products WHERE ?";
        connection.query(query, {id: answer.id} , function(err, res) {
            if (err) throw err;
            res.map(info => {
                let productInfo = {
                    id: info.id,
                    Product_name: info.product_name,
                    Department: info.department_name,
                    Price: "$" + info.price,
                    Stock_quantity: info.stock_quantity
                };
                let displayInfo = "Product: " + " " + productInfo.Product_name + " Current Stock: " + productInfo.Stock_quantity;
                console.log(displayInfo);
                inquirer
                    .prompt({
                        name: "item",
                        type: "input",
                        message: "How many would you like to add?"
                    })
                    .then(function(answer2) {
                        let itemQuant = answer2.item;
                        let chosProductStock = productInfo.Stock_quantity;
                        let newStock = parseInt(chosProductStock) + parseInt(itemQuant);
                        let item = productInfo.id;
                            // console.log(newStock);
                            // console.log("This is the current product stock " + productInfo.Stock_quantity);
                            let stockQuery = connection.query(
                                "UPDATE products SET ? WHERE ?", 
                                [
                                    {
                                        stock_quantity: newStock
                                    },
                                    { 
                                        id: item
                                    }
                                ],
                                function(err, res) {
                                    if (err) throw err;
                                    console.log("The stock for " + productInfo.Product_name + " has been updated to: " + newStock);
                                    runManager();
                            
                                 })
                        })
                });
            });    

    });
}//END of addInventory();


 //Function newProduct();
 function newProduct() {


 };//END of newProduct();

//  inquirer
//                 .prompt({
//                     name: "action",
//                     type: "rawlist",
//                     message: "Would you like to add inventory to one of these items?",
//                     choices: [
//                         "Yes",
//                         "No"
//                     ]
//                 })
//                 .then(function(answer) {
//                     switch (answer.action) {
//                         case "Yes":
//                         inquirer
//                             .prompt({
//                                 name: "action",
//                                 type: "rawlist",
//                                 message: "Which Item would you like to add inventory to?",
//                                 choices: [
                                    
//                                 ]
//                         })
//                         //Prompt with choices being display info.
//                         break;

//                         case "No":
//                         runManager();
//                         break;
//                     };

//                 })