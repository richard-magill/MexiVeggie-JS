/*  Richard Magill
ICT-4510-1, Advanced Web Design
1.  Created the MexiVeggie website.
2.  Site includes Bootstrap4 responsive styling, header, footer, and Nav menu
3.  Home page includes Carousel image control with photos
4.  About page includes a map using Mapbox and Leaflet.js css and js references
5.  Admin page includes Login, Logout, deleteMenuItem() and addMenuItem() functions. 
    Login sends credentials to Heroku API via POST, and then receives back user object and token, which are stored to 
    session storage.   Logout clears session storage and refreshes page.   deleteMenuItem() function calls DELETE in
    Heroku API, passing token in header and api_key as parameter.   addMenuItem() function calls POST, again passing token
    and api-key, but additionally passing JSON item, description, and price in the body of the request.
6.  Menu page shows the menu items in a table format, using GET in the Heroku API.  Note that no token is required in the 
    GET, as it should be publically accessible and doesn't modify the collection. 

Super fun assignment!

*/

//click handler for login
function clickLogin() {
  let loginForm = {
    username: String,
    password: String,
  };
  loginForm.username = document.querySelector("#username").value;
  loginForm.password = document.querySelector("#password").value;
  loginToApi(loginForm);
}

//login with fetch api and store token in session storage
async function loginToApi(loginForm) {
  let response = await fetch("https://ict4510.herokuapp.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginForm),
  });
  console.log(response.status);
  console.log(response.statusText);
  if (response.status === 200) {
    let data = await response.json();
    console.log(data);
    //put user token into session storage
    sessionStorage.setItem("user", JSON.stringify(data));
    sessionStorage.setItem("token", data.user.token);
    //show welcome, passing in name from the user token
    displayWelcome(data.user.first_name);
    showForms();
  } else alert("Login unsuccessful");
}

//async fetch to get menu items back
async function getMenuItems() {
  let response = await fetch(
    "https://ict4510.herokuapp.com/api/menus?api_key=408737cb5bc864b67df79c062b578dd2",
    {
      method: "GET",
    }
  );
  console.log(response.status);
  console.log(response.statusText);
  if (response.status === 200) {
    let data = await response.json();
    console.log(data);
    // when you get menu items, hide spinner and show menu data
    if (response) {
      hideloader();
    }
    showMenu(data);
  } else alert("No Menu Items");
}

//show welcome
function displayWelcome(name) {
  const display = "Welcome " + name + "!";
  const newParagraph = document.createElement("p");
  var textNode = document.createTextNode(display);
  newParagraph.appendChild(textNode);
  var element = document.getElementById("text1");
  element.appendChild(newParagraph);
  hideLogin();
}

//hide login form
function hideLogin() {
  const formDiv = document.getElementById("loginForm");
  formDiv.style.display = "none";
}

//show delete form and add form
function showForms() {
  const deleteDiv = document.getElementById("deleteForm");
  deleteDiv.style.display = "block";
  const addDiv = document.getElementById("addForm");
  addDiv.style.display = "block";
  const logoutDiv = document.getElementById("logout");
  logoutDiv.style.display = "block";
}

// see if user already has a session
function checkUserSession() {
  if (sessionStorage.length > 0) {
    showForms();
    hideLogin();
  }
}

//function to show menu on Menu.html
function showMenu(data) {
  let tab = `<tr>
      <th width='5%'></th>
          <th width='20%'><h3><u>Item </u></h3></th>
          <th width='5%'></th>
          <th width='40%'><h3><u>Description</u> <h3></th>
          <th width='10%'></th>
          <th width='20%'><h3><u>Price </u><h3></th>
         </tr>`;
  // Loop to access all rows
  for (let x of data.menu) {
    tab += `<tr> 
      <th width='5%'></th>
      <td width='20%'><h4>${x.item} </h4></td>
      <th width='5%'></th>
      <td width='40%'><h4>${x.description}</h4> </td>
      <th width='10%'></th>
      <td width='20%'><h4>${x.price} </h4></td>          
  </tr>`;
  }
  // Setting innerHTML as tab variable
  document.getElementById("menuTable").innerHTML = tab;
}

// Function to hide the loader
function hideloader() {
  document.getElementById("loading").style.display = "none";
}

//async fetch to get menu items back with id, for use on admin page
async function getMenuItemsWithId() {
  let response = await fetch(
    "https://ict4510.herokuapp.com/api/menus?api_key=408737cb5bc864b67df79c062b578dd2",
    {
      method: "GET",
    }
  );
  console.log(response.status);
  console.log(response.statusText);
  if (response.status === 200) {
    let data = await response.json();
    console.log(data);
    populateSelect(data);
  } else alert("No Menu Items");
}

//function to populate the select dropdown
function populateSelect(data) {
  let ele = document.getElementById("dropdownMenuItems");
  // Loop to access all rows
  for (let x of data.menu) {
    ele.innerHTML =
      ele.innerHTML +
      '<option value="' +
      x["id"] +
      '">' +
      x["item"] +
      "</option>";
  }
}

//click handler for delete
function clickDelete() {
  const id = document.querySelector("#dropdownMenuItems").value;
  const token = sessionStorage.getItem("token");
  deleteMenuItem(id, token);
}

//async fetch to delete an item, requires token
async function deleteMenuItem(itemId, token) {
  let response = await fetch(
    "https://ict4510.herokuapp.com/api/menus?api_key=408737cb5bc864b67df79c062b578dd2&id=" +
      itemId,
    {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    }
  );
  console.log(response.status);
  console.log(response.statusText);
  if (response.status === 204) {
    alert("Item deleted");
  } else alert("Delete failed");
}

//click handler for add menu item
function clickAdd() {
  let addForm = {
    item: String,
    description: String,
    price: String,
  };
  addForm.item = document.querySelector("#item").value;
  addForm.description = document.querySelector("#description").value;
  addForm.price = document.querySelector("#price").value;
  const token = sessionStorage.getItem("token");
  addMenuItem(addForm, token);
}

//async fetch to add menu item, for use on admin page, requires token
async function addMenuItem(addForm, token) {
  let response = await fetch(
    "https://ict4510.herokuapp.com/api/menus?api_key=408737cb5bc864b67df79c062b578dd2",
    {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addForm),
    }
  );
  console.log(response.status);
  console.log(response.statusText);
  if (response.status === 201) {
    let data = await response.json();
    console.log(data);
    alert("Item added");
  } else alert("Add item failed");
}

//clear session storage if use logs out
function clickLogout() {
  sessionStorage.clear();
  window.location.reload();
}
