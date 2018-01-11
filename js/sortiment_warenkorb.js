        /* global firebase */
        // Initialize Firebase
        // TODO: Replace with your project's customized code snippet
        var config = {
            apiKey: "AIzaSyDR4bKKZ8nkBIrS-H9i1s5UH822fM9rkQc",
            databaseURL: "https://das-cafe-kramer.firebaseio.com",
            authDomain: "das-cafe-kramer.firebaseapp.com",
        };
        firebase.initializeApp(config);
        /* This change listener calls the loginChanged() function 
         * whenever a user logs in or out */
        firebase.auth().onAuthStateChanged(loginChanged);
        // Get a reference to the products
        var productsRef = firebase.database().ref('products');
        // Define a global variable for the shopping cart database reference
        var cartRef;
        var cart;
        
        // Listen for changes to the welcome message
        productsRef.on('value', refreshProdcutList);
        /* This function sets the h1 text to whatever is returned
         * from the database */
        
        function order() {
            console.log("Order started");
            console.dir(cart);
            
            var user = firebase.auth().currentUser;
            var orderRef = firebase.database().ref("orders/" + user.uid);
            orderRef.push(cart);
            
            // Delete shopping cart
            cartRef.set(null);
        } 
         
         
        function refreshProdcutList(value) {
            var products = value.val();
            // Get the div element that contains the products
            var listContainer = document.querySelector("#productList");
            listContainer.innerHTML = "";
            // Loop through each product in the result
            products.forEach(
                function(product, index) {
                    // Create a new div element using JavaScript
                    var newDiv = document.createElement('div');
                    // Add the bootstrap class and our own product class
                    newDiv.className += "col-md product";
                    /* Add necessary data attributes for the shopping cart functionality
                     * We can later access these attributes from the addToCart function */
                    newDiv.setAttribute("data-id", index);
                    newDiv.setAttribute("data-beschreibung", product.beschreibung);
                    newDiv.setAttribute("data-preis", product.preis);
                    newDiv.setAttribute("data-name", product.name);
                    // Add the name, description and price to the div
                    newDiv.innerHTML = '<h4>' + product.name + '</h4><p>' + product.beschreibung + '</p><p><strong>' + product.preis + "€" + '</strong></p><button onclick="addToCart(this)" class="btn btn-primary addCartBtn" disabled>kaufen</button>';
                    // Add the div to the parent container
                    listContainer.appendChild(newDiv);
                });
            // Make sure you enable or disable correctly
            var user = firebase.auth().currentUser;
            if (user) {
                var addToCartButtons = document.getElementsByClassName("addCartBtn");
                [].forEach.call(addToCartButtons, btn => { btn.removeAttribute("disabled"); });
            }
            else {
                var addToCartButtons = document.getElementsByClassName("addCartBtn");
                [].forEach.call(addToCartButtons, btn => { btn.setAttribute("disabled", ""); });
            }
        }
        /* This function is called when the user clicks
         * the login button. */
        function login() {
            // Get the values from the email and password input fields
            var email = document.getElementById("inputEmail").value;
            var password = document.getElementById("inputPassword").value;
            /* Call the sign in function provided by the Firebase API 
             * and pass the email and password */
            firebase.auth().signInWithEmailAndPassword(email, password).catch(handleError);
        }
        /* This function is called when the user clicked the 
         * logout button */
        function logout() {
            firebase.auth().signOut().then(function() {
                console.log("User successfully signed out.");
            }).catch(handleError);
        }
        /* This is the callback function when the user changed.
         * Either because a new user logged in, or the current user
         * signed out. */
        function loginChanged(user) {
            // If the user variable is set, a user is logged in
            if (user) {
                console.log("Successfully logged in!");
                document.getElementById("btnLogout").removeAttribute("disabled");
                document.getElementById("btnLogin").setAttribute("disabled", "");
                var addToCartButtons = document.getElementsByClassName("addCartBtn");
                [].forEach.call(addToCartButtons, btn => { btn.removeAttribute("disabled"); });
                // Add a listener for the user's shopping cart
                cartRef = firebase.database().ref('shoppingcarts/' + user.uid);
                cartRef.on('value', cartChanged);
            }
            else {
                console.log("No user logged in!");
                document.getElementById("btnLogin").removeAttribute("disabled");
                document.getElementById("btnLogout").setAttribute("disabled", "");
                var addToCartButtons = document.getElementsByClassName("addCartBtn");
                [].forEach.call(addToCartButtons, btn => { btn.setAttribute("disabled", ""); });
                // Remove any listeners to cart data
                if (cartRef) {
                    cartRef.off('value', cartChanged);
                }
                var itemsList = document.getElementById("itemsList");
                var total = document.getElementById("total");
                itemsList.innerHTML = "";
                total.innerHTML = "Nothing in cart";
            }
        }


        function cartChanged(newCart) {

            cart = newCart.val();
            
      
            var itemsList = document.getElementById("itemsList");
            itemsList.innerHTML = "";
            var total = 0;

            for (var key in cart) {
            
                var item = cart[key];
                
                var listItemText = item.name + ": " + item.preis + " x " + item.quantity + " = " + item.preis * item.quantity + " EUR";
                var newItem = document.createElement("li");
                newItem.innerHTML = listItemText;
                itemsList.appendChild(newItem);
                total += item.preis * item.quantity;
            }
            document.getElementById("total").innerText = total + " EUR";

        }
        /* This function is called when a "Buy now" button is pressed 
         */
        function addToCart(event) {

            var user = firebase.auth().currentUser;

            if (user) {
                var productObj = {
                    id: event.parentElement.dataset.id,
                    name: event.parentElement.dataset.name,
                    beschreibung: event.parentElement.dataset.beschreibung,
                    preis: event.parentElement.dataset.preis,
                    quantity: 1
                }

                console.dir(productObj);

                // The database path to the current user's cart and the current product
                var cartRef = firebase.database().ref('shoppingcarts/' + user.uid + "/" + productObj.id);
                // Get the current product from the cart (if is already there)
                cartRef.once('value', function(value) {
                    var productInCart = value.val();
                    // If the product is already in the cart, add one to the quantity
                    if (productInCart) {
                        productObj.quantity = productInCart.quantity + 1;
                    }
                    // Update (or add) the product in the cart
                    cartRef.set(productObj);
                });
            }
        }
        /* This is called if something goes wrong when logging in or logging out.
         * For example if the user's password is wrong. */
        function handleError(error) {
            console.error(error.code + ": " + error.message);
        }