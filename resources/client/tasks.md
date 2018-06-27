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
