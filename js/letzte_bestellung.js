 /* global firebase */
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDR4bKKZ8nkBIrS-H9i1s5UH822fM9rkQc",
            databaseURL: "https://das-cafe-kramer.firebaseio.com",
            authDomain: "das-cafe-kramer.firebaseapp.com",
        };
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(loginChanged);

        // Define a global variable for the Order cart database reference
        var cartOrder;
        var cartRef

        function getSumOfOrder(order) {

            var sum = 0;

            for (var productkey in order) {
                var product = order[productkey];
                console.log(product.preis);
                sum += product.preis * product.quantity;
            }

            return sum;
        }

        function orderChanged(newOrders) {
            console.log("reading orderList");
            console.dir(newOrders.val());
            cartOrder = newOrders.val();

            var orderList = document.querySelector("#orderList");
            orderList.innerHTML = "";
            var total = 0;

            for (var key in cartOrder) {

                var order = cartOrder[key];
                console.dir(order);

                var sum = getSumOfOrder(order);

                total += sum;

                var listItemText = "Bestellsumme: " + sum + " EUR";
                var newOrder = document.createElement("li");
                newOrder.innerHTML = listItemText;

                var productListForOrder = document.createElement("ul");

                for (var productkey in order) {
                    var product = order[productkey];
                    var productListItem = document.createElement("li");
                    productListItem.innerHTML = product.name + ", Preis: " + product.preis + ", Menge: " + product.quantity;
                    productListForOrder.appendChild(productListItem);
                }

                newOrder.appendChild(productListForOrder);
                orderList.appendChild(newOrder);

            }
            document.getElementById("total").innerText = total + " EUR";
            console.log("var listItemText:", listItemText);
            console.log("order.name:", order.name);
            console.log("var order:", order);
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
                cartRef = firebase.database().ref('orders/' + user.uid);
                cartRef.on('value', orderChanged);
            }
            else {
                console.log("No user logged in!");
                document.getElementById("btnLogin").removeAttribute("disabled");
                document.getElementById("btnLogout").setAttribute("disabled", "");
                var addToCartButtons = document.getElementsByClassName("addCartBtn");
                [].forEach.call(addToCartButtons, btn => { btn.setAttribute("disabled", ""); });
                // Remove any listeners to cart data
                if (cartRef) {
                    cartRef.off('value', orderChanged);
                }
                var orderList = document.getElementById("orderList");
                var total = document.getElementById("total");
                ordersList.innerHTML = "Bitte zuerst anmelden!";
                total.innerHTML = "Bitte zuerst anmelden!";
            }
        }