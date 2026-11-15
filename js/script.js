//Event listener to load states
document.addEventListener("DOMContentLoaded", loadStates);

//Event listener to load counties
document.querySelector("#state").addEventListener("change", loadCounties);

//Change event listener to ZIP code textbox
document.querySelector("#zip").addEventListener("change", displayCity);

//Change event listener to username textbox
document.querySelector("#username").addEventListener("change", checkUsername);

//Submit event listener to form
document.querySelector("#signupForm").addEventListener("submit", validateForm);

//Event listener for a suggested password
document.querySelector("#password").addEventListener("click", suggestedPassword);

async function displayCity() {
 //alert(document.querySelector("#zip").value);

 try {
  let zipCode = document.querySelector("#zip").value;
  let url = `https://csumb.space/api/geo/cityInfoAPI.php?zip=${zipCode}`;
  let response = await fetch(url);
  let data = await response.json();

  //the API returns false when the zip code is not found, so we can check for that case before trying to access
  if (data === false) {
   document.querySelector("#city").textContent = "Zip code not found";
   document.querySelector("#latitude").textContent = "";
   document.querySelector("#longitude").textContent = "";
   return;
  }
  document.querySelector("#city").textContent = data.city;
  document.querySelector("#latitude").textContent = data.latitude;
  document.querySelector("#longitude").textContent = data.longitude;

 } catch (error) {
  document.querySelector("#city").textContent = "Unable to retrieve city";
  console.error(error);
 }
}

//Function to load states from the API and populate dropdown menu
async function loadStates() {
 let stateMenu = document.querySelector("#state");

 stateMenu.textContent = "";

 let defaultOption = document.createElement("option");
 defaultOption.value = "";
 defaultOption.textContent = "Select One";
 stateMenu.appendChild(defaultOption);

 try {
  let url = "https://csumb.space/api/allStatesAPI.php";
  let response = await fetch(url);
  let data = await response.json();

  for (let item of data) {
   let option = document.createElement("option");
   option.value = item.usps;
   option.textContent = item.state;
   stateMenu.appendChild(option);
  }
 } catch (error) {
    console.error(error);
    
    stateMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load states";
    stateMenu.appendChild(errorOption);
 }
}

//Function to load counties based on two letters from state
async function loadCounties() {
 let state = document.querySelector("#state").value;
 let countyMenu = document.querySelector("#county");

 countyMenu.textContent = "";

 if (state === "") {
  return;
 }

 try {
  let url = `https://csumb.space/api/geo/countyListAPI.php?state=${state}`;
  let response = await fetch(url);
  let data = await response.json();

  for (let item of data) {
   let option = document.createElement("option");
   option.value = item.county;
   option.textContent = item.county;
   countyMenu.appendChild(option);
  }
 } catch (error) {
    console.error(error);
 }
}

//API version of checkUsername() function
async function checkUsername() {
 let username = document.querySelector("#username").value;
 let usernameError =  document.querySelector("#usernameError");

 if (username.length === 0) {
  usernameError.textContent = "Username required";
  usernameError.style.color = "red";
  return false;
 }

 let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
 let response = await fetch(url);
 let data = await response.json();

 if (data.available) {
  usernameError.textContent = "Username available!";
  usernameError.style.color = "green";
  return true;
 } else {
  usernameError.textContent = "Username taken";
  usernameError.style.color = "red";
  return false;
 }
}

//Function of validateForm(event)
async function validateForm(event) {
 event.preventDefault();
 
 let isValid = true;

 let username = document.querySelector("#username").value;
 let usernameError = document.querySelector("#usernameError");

 usernameError.textContent = "";

 if (username.length === 0) {
  usernameError.textContent = "Username required";
  usernameError.style.color = "red";
  isValid = false;
 } else {
   let usernameAvailable = await checkUsername();

   if (usernameAvailable === false) {
    isValid = false;
   }
 }

 //Password validation
 let password = document.querySelector("#password").value;
 let passwordAgain = document.querySelector("#passwordAgain").value;
 let passwordError = document.querySelector("#passwordError");

 passwordError.textContent = "";

 if (password.length < 6) {
  passwordError.textContent = "Password must have at least 6 characters";
  passwordError.style.color = "red";
  isValid = false;
 } else if (password !== passwordAgain) {
  passwordError.textContent = "Password does not match";
  passwordError.style.color = "red";
  isValid = false;
 }

 if (isValid) {
  document.querySelector("#signupForm").submit();
 }
}

//Function for a suggested password
function suggestedPassword() {
 let password = Math.random().toString(25).slice(2, 10);

 document.querySelector("#suggestedPassword").textContent = "Suggested Password: " + password;
}