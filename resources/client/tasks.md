



13 iulie 2018

- get the products from the shopify app.
- get the categories from shopify.

Build a new file just for prestashop.
Make it a full blown firebase included functionality module.
Put everything in a cloud function.

Build the woocommerce module.
Put it into a firebase function.

Build the shopify module.
Put into a firebase function.

Deploy the functions.

Build another function that acts as an intermediary skeduler.
This will read form realtime database..  how fast needs to invoke the other 3 cloud functions.

Skedule this 4th function with firebase built in skedulers.





HANDLE SECURITY!!!
Or tell people this is not secure.

## where i am:

- i have the appCtrl which is the one controlling the menu.. being abstract in ui router.

- i have the home page.. categories are loaded and displayed form firebase.

- i aded 2 functions in backend .. one for quering the first x products form a cat.

- second from quering products of a category based on an offset key, this will be used for infinite scrolling.

Next tasks:
DONE: clicking on a category should open that exact cat.. pass the category id to the individual category page. This means the list of products is queried from firebase based on that specific category.

add fake 3 fake products to firebase and link them to this category: -LFWaisUPF_XssTJE10r



## Finishing product page.


Reviews for One product.
- bind the reviews list inside the dom.
- add ability to create review.
- use a dummy user for now.


REPLIES for ONE REVIEW
- construct a replies reference in firebase.
- bind that to the dom - show the replies out..


create and send reply.
- add a button for sending the reply
- bind a reply on click even to that button
- use replies reference to $add() on it.


security.
- ensure that the user logged in is the only one able to reply to stuff.


Read trough the firestore auth..


Ok so today:


Login DONE.
- finish the form validation for Login page.

Register DONE.
- finish the form validation there..
- show errors
  - add dom elements for errors.
  - add logic for displaing that errors individually for each input.
  - add a shared error that comes form firebase as a result of the  registration process.




Product page:

- Leave review if you are a logged in user functionality


Today 29 june.

Finish the product page first.
- add 2 more fake products in firebase.
- check to see if recently viewd functionality is working.. and most importantly if is working in real time.. meaning if i can update something in firebase.. and then it changes in recently viewed products.


Think about how to do the chart / orders thing.
Implement the shopping cart.. and also send order functionality.

Load all products for a category.



Fix the user profiule page.

//
then link the links form user profile to onther places..

///////////////
setup the  address.
setup email..
setup the phone number.


// create user profile upon registration.



// Working on the favorites page.
- decide what adding something to favirite means
  - most problably we just going to add a product id(firebase push key) to a list of favorites on our profile.
- when on favorites page.. check first if the user is logged in.
- if he is logged in, then create a binding to the favorites object... we do that with firebase Array 3 way databinding.
- after that.. for each product in favorites.. i need to load and create a call for getting that specific product out.

- i need that to be real time also.. so i need an objects with productId's as keys .. aand also a connection for each of them to a firebnase object.

{key: $firebaseObject(ofProduct.)}

this way any product will be real time.
but i need to do this with some diffing mechanism..

or just build a service.. and if we already have a product..
we can listen for an on value event..
then grab that list of product ids..

when it comes back.. then map over each one.. and load the product into a service called FavoriteProductsService.

and this service.. is just keeping a real live reference to each product.. and we then in the favorites.. ups..not good.
we need to do this in controller also .. no point for creating a service just for this.. i mean.. i just don't see the point since it will only be accessed on favorites page.

but i need that value event.
and do a diffing..
on the object.

i need a method .. key exists.
if key exists.. then i don't create a new reference for that product..
if it doesn't then we create one.



// add functionalty to product such that we can add it to favoites.
1. ensure a user is logged in before adding that add to favorites button.
2. create a dom element for it.
3. add an ng-click on is with function name: addToFavorites(productId)
4. grab the uid form the AuthService.


MOVE USER PROFGILE IN AUTH SERVICE.

Add cart functionality

needs a reference to product id..
needs some metadata like how many products.
and this happens for each proiduct.


so first let's make a function to react a  new product when the add to cart buytton is presdsded
console.log something when is pressed.
then create the purchase object there.

--------






Bugs.
<!-- Pagina de favorite arata empooty can d are producse. DONE. -->
<!-- Afisez statusul orderului .. DONE. -->
<!-- Email validation in settings. -->
<!-- reverse list of recently viewed products. -->
La comentaiii in pagina de produs.. userul apare nelogat.




--
