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

//Function for runManager();
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
            "Add New Product",
            "End Manager Session"
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
            addInventory();
            break;

            case "Add New Product":
            newProduct();
            break;

            case "End Manager Session":
            endSession();
            break;
        }
    })
}//END of runManager();

//Function for viewProducts();
function viewProducts(callback) {
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
          callback();
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
    viewProducts(promptMe);
    function promptMe() {
        inquirer.prompt({
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
    }

}//END of addInventory();

//Function newProduct();
function newProduct() {
    console.log("Inserting a new product...\n");
    inquirer.prompt([
        {
            name: "ProdName",
            type: "input",
            message: "What is the product name?"
        },

        {
            name: "depName",
            type: "input",
            message: "What department is this product from?"
        },

        {
            name: "prodPrice",
            type: "input",
            message: "How much will this item cost?"
        },
        {
            name: "prodStock",
            type: "input",
            message: "What is the total initial stock number?"
        }

    ])
    .then(function(answer){
        let newProdName = String(answer.ProdName);
        let newDepName = String(answer.depName);
        let newProdPrice = answer.prodPrice;
        let newProdStock = answer.prodStock;
        // console.log(newProdName);
        var newProdQuery = connection.query(
                "INSERT INTO products SET ?",
                {
                product_name: newProdName,
                department_name: newDepName,
                price: newProdPrice,
                stock_quantity: newProdStock
                },
                function(err, res) {
                console.log(res.affectedRows + " product inserted!\n");
                }
            );
        // console.log(`
        // ${newProdName}
        // ${newDepName}
        // ${newProdPrice}
        // ${newProdStock}
        // `)
        runManager(); 
    })
            
};//END of newProduct();

function endSession() {
        console.log("This manager session is now closed")
        connection.end();
};//END endSession();