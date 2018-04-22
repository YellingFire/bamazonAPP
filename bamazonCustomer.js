const mysql = require("mysql");
const inquirer = require("inquirer");
let displayInfo;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //function goes here
  getProducts();
//   connection.end();
});

function getProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
    //   console.log(res);
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
        // startBamazon();
        }); 
        startBamazon();  
    });
  }
  
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
                let displayInfo = "Product: " + productInfo.Product_name + "Costs" + productInfo.Price + " each.";
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
                        console.log("The total for your order of " + answer2.item + " " + productInfo.Product_name + " is: " + "$" + info.price * answer2.item);  
                        confirmPurchase(productInfo.id);                     
    
                    });                
                })   
            })
        });
};
//END of startBamazon()

function confirmPurchase(itemAbove) {
    console.log("This item was passed from startBamazon: " + itemAbove);
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
                //Check stock_quantity here
                //Insert Update DB function
                console.log("Your purchase is confirmed and will be delivered according to Bamazon's Delivery Policy.\n Thank you for shopping with Bamazon!")
            }

            else if (answer3.action === "Start Over") {                
                getProducts();
                // console.log("run start over sequence");
            };    
        })
}; //END confirmPurchase();



// connection.end();