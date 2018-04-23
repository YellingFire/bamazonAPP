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
  getProducts();
});

//This function starts bamazon by displaying all available products
function getProducts() {
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
        startBamazon();  
    });
}//END of getProducts();
  
//This function starts the bamazon purchase  
function startBamazon() {
    inquirer
    .prompt({
        name: "id",
        type: "input",
        message: "Please enter the item number of the product you would like to buy."
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
                let displayInfo = "Product: " + " " + productInfo.Product_name + " Costs: " + productInfo.Price + " each.";
                console.log(displayInfo);
                inquirer
                    .prompt({
                        name: "item",
                        type: "input",
                        message: "How many would you like to buy?"
                    })
                    .then(function(answer2) {
                        // console.log(info.price);
                        // console.log(answer2.item);
                        // console.log(productInfo.Product_name);
                        console.log("The total cost for your order of " + answer2.item + " " + productInfo.Product_name + " is: " + "$" + info.price * answer2.item);  
                        confirmPurchase(productInfo.id, answer2.item);                     
    
                    });                
                })   
            })
        });
};//END of startBamazon();

//This function handles confirmation of purchase as well as checking for stock and updating stock
function confirmPurchase(itemAbove, answer2) {

    let purchaseItemId = itemAbove;
    let itemQuant = answer2;

    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Please confirm your purchase",
            choices: [
                "Confirm",
                "Start Over"
            ]
        })
        .then(function(answer3) {
            if (answer3.action === "Confirm") {
                connection.query("SELECT stock_quantity FROM bamazon_db.products WHERE id =" + purchaseItemId, function(err, res) {
                    if (err) throw err;
                    res.map(itemID => {
                        let productStock = itemID.stock_quantity;
                        // console.log(productStock);
                        if (itemQuant <= productStock) {
                            let newStock = productStock - itemQuant;
                            // console.log(newStock);
                            let stockQuery = connection.query(
                                "UPDATE products SET ? WHERE ?", 
                                [
                                    {
                                        stock_quantity: newStock
                                    },
                                    { 
                                        id: purchaseItemId 
                                    }
                                ],
                                function(err, res) {
                                    if (err) throw err;
                                    console.log("Your purchase was successful\nThank you for shopping with Bamazon");

                                    setTimeout(function() {
                                        console.log("Please wait, Bamazon is re-loading")
                                    }, 2000);

                                    setTimeout(function() {
                                        startOver();
                                    }, 2000);
                                    
                                    // console.log(stockQuery.sql);
                                    // console.log("Products updated!\n");
                                }
                            );
                            }//END of first IF

                            else if (itemQuant > productStock) {
                                console.log("There are only " + productStock + " left.\n");

                                setTimeout(function() {
                                    console.log("You will now be directed to the main products list");

                                }, 2000)

                                setTimeout(function() {
                                    getProducts();
                                }, 4000)                    
                            }//END of else if                            
                        })                        
                    });
                }
            else {
                getProducts();
            }
        });   
};//END of confirmPurchase();

//This function handles the start and end to the bamazon experience
function startOver() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Would you like to make another purchase?",
            choices: [
                "Yes, I want to make another purchase",
                "No thank you, I'm done shopping for now."
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Yes, I want to make another purchase":
                getProducts();
                break;

                case "No thank you, I'm done shopping for now.":
                console.log("Thank you for shopping with Bamazon");
                connection.end();
                break;
            }
        })
};//END startOver();
