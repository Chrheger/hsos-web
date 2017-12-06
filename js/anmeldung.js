/* global firebase */
    /* Replace with your project's information */
    var config = {
        apiKey: "AIzaSyDR4bKKZ8nkBIrS-H9i1s5UH822fM9rkQc",
        databaseURL: "https://das-cafe-kramer.firebaseio.com",
        authDomain: "das-cafe-kramer.firebaseapp.com",
    };
    firebase.initializeApp(config);
    /* This change listener calls the loginChanged() function 
     * whenever a user logs in or out */
    firebase.auth().onAuthStateChanged(loginChanged);
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
    /* This function is called when the user clicke the 
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
            // Hide the login form
            document.getElementById("loginForm").setAttribute("hidden", "");
            // Show the update profile form
            document.getElementById("updateProfileForm").removeAttribute("hidden");
            // Show the logout button
            document.getElementById("btnLogout").removeAttribute("hidden");
            updateDisplay();
            console.log("Successfully logged in!");
        }
        // No user logged in
        else {
            // Show the login form
            document.getElementById("loginForm").removeAttribute("hidden");
            // Hide the update profile form
            document.getElementById("updateProfileForm").setAttribute("hidden", "");
            // Hide the logout button
            document.getElementById("btnLogout").setAttribute("hidden", "true");
        }
    }
    function updateProfile() {
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: document.getElementById("inputDisplayName").value,
            photoURL: document.getElementById("inputPhotoUrl").value
        }).then(function() {
            console.log("Profile update was successful!");
            updateDisplay();
        }).catch(handleError);
        /* This call writes the extended properties
         * to the Firebase real-time database */
        updateExtendedProfile();
    }
    function updateExtendedProfile() {
        var user = firebase.auth().currentUser;
        if (user) {
            var zipCode = document.getElementById("inputZipCode").value;
            var city = document.getElementById("inputCity").value;
            var hobby = document.getElementById("inputHobby").value;
            var newsletter = document.getElementById("inputCheckboxNewsletter").checked;
            var userRef = firebase.database().ref('userprofiles/' + user.uid);
            userRef.set({
                Hobby: hobby,
                PLZ: zipCode,
                Stadt: city,
                Newsletter_abboniert: newsletter
            });
        }
    }
    /* This function update the profile picture
     * and the display name on the website */
    function updateDisplay() {
        var user = firebase.auth().currentUser;
        // Populate form with profile values
        document.getElementById("inputDisplayName").value = user.displayName;
        document.getElementById("inputPhotoUrl").value = user.photoURL;
        // Set image and title of the card
        if (user.displayName)
            document.getElementById("cardUserDisplayName").innerText = user.displayName;
        if (user.photoURL)
            document.getElementById("imgProfilePhoto").setAttribute("src", user.photoURL);
        // Read the extended user profile from the database
        firebase.database().ref('userprofiles/' + user.uid).once('value', function(value) {
            document.getElementById("displayZipCode").innerText = value.val().PLZ;
            document.getElementById("displayCity").innerText = value.val().Stadt;
            document.getElementById("displayHobby").innerText = value.val().Hobby;
            // Set the form values
            document.getElementById("inputZipCode").value = value.val().PLZ;
            document.getElementById("inputCity").value = value.val().Stadt;
            document.getElementById("inputHobby").value = value.val().Hobby;
            document.getElementById("inputCheckboxNewsletter").checked = value.val().subscribeNewsletter;
        })
    }
    /* This is called if something goes wrong when logging in or logging out.
     * For example if the user's password is wrong. */
    function handleError(error) {
        console.error(error.code + ": " + error.message);
    }
 