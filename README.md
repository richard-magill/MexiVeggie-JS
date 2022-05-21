# MexiVeggie-JS
A fake restaurant application in vanilla JS

This code has:  
Site includes session storage, JWT token usage, Promises, Fetch, Bootstrap4 responsive styling, header, footer, and Nav menu
1.  Home page includes Carousel image control with photos
2.  About page includes a map using Mapbox and Leaflet.js css and js references
3.  Admin page includes Login, Logout, deleteMenuItem() and addMenuItem() functions. 
    Login sends credentials to Heroku API via POST, and then receives back user object and token, which are stored to 
    session storage.   Logout clears session storage and refreshes page.   deleteMenuItem() function calls DELETE in
    Heroku API, passing token in header and api_key as parameter.   addMenuItem() function calls POST, again passing token
    and api-key, but additionally passing JSON item, description, and price in the body of the request.
4.  Menu page shows the menu items in a table format, using GET in the Heroku API.  Note that no token is required in the 
    GET, as it should be publically accessible and doesn't modify the collection. 

5. the backend is a Heroku app provide by DU, so to login you need you own API or a mock

IDE: VSCode
