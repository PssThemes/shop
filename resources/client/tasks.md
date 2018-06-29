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
