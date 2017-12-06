/* product sortiment seite*/
/* global firebase */
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: "AIzaSyDR4bKKZ8nkBIrS-H9i1s5UH822fM9rkQc",
    databaseURL: "https://das-cafe-kramer.firebaseio.com"
};
firebase.initializeApp(config);
// Get a reference to the database's welcome text
var productsRef = firebase.database().ref('products');
// Listen for changes to the welcome message
productsRef.on('value', refreshProdcutList);
/* This function sets the h1 text to whatever is returned
 * from the database */
function refreshProdcutList(value) {

    var products = value.val();
    // Get the div element that contains the products
    var listContainer = document.querySelector("#productList");
    listContainer.innerHTML = "";
    // Loop through each product in the result
    products.forEach(
        function(product) {
            // Create a new div element using JavaScript
            var newDiv = document.createElement('div');
            // Add the bootstrap class and our own product class
            newDiv.className += "col-md product";
            // Add the name, description and price to the div
            newDiv.innerHTML = '<h4>' + product.name + '</h4><p>' + product.beschreibung + '</p><p><strong>' + product.preis + " €" + '</strong></p><a href="#" class="btn " >Hier vorbestellen</a>';
            // Add the div to the parent container
            listContainer.appendChild(newDiv);
        });
}
