
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================

20 iulie 2018
- detect what is needed for performing the update/delete/create check.
  - get all ids from the shop.
- decide how to deal with the fact that a product is in multiple categories in prestashop.
- so far we have 1 product in 1 category.
- again the category is what we have intenrally, but is different since 1 cateogy is linked to other categoires.. and not to products.

our category is a pointer to many other categories.
which means many products to 1 category.
which is ok..
problem is when same product is included in 2 different categories.. by us maping 1 custom category
to 2 external categories.

2 custom categories mapping to the same external category.
now the product.. has no ability to belong in 2 custom categories by the current implementation.

is quite hard to change it since it requires a one to many mapping.
Filtering products by category is affected.

For theis to be solved for certain i need a listo of categoies ids on the product .. and not only one.
Maybe is not that serious of a change.
Everywere im loading products by category will be affected.
Saving product will be affected.

Or i can just create the product with the the custom categories included.
But how to know that..
Like how to detect if the product is in what custom category.

Making your own mapping was included in the requirement.. and current model of the project does not meet that.

When creating a product.. which is mapped to many custom categoires.. we gonna have this problem that we wanna know this categories ids.
This requires.. taking any external category this product belongs into..
and then finding all the asociated custom categories..
then grabing all the ids of this custom categories in an array.. and put them on the product beeing created.

When updating the product .. same idea.
We need to detect if the external categories asociated with this product.. have also been changed.
we need to incluse external categoires asociated with this product to create the check.
if external categories changed.. maybe the internal ones changed too.
but we will no perform selective update just for category.. we perform a flull blown update on all records trhat matter plus the categoryes.

So for that when the update needs to happen..
we need to extract the custom categories associated with this external categories that the product has on it.
So extracting the custom categories.. is done based on what external categories we have in the new product..
Need to grab all custom categories recorsds that contain the external category id.
Best way to do it is to load up all the categories from this particular shop.
THen filter them locally.. extract / accumulate  only the ones  that have the appropriate external categories on them.
Then once extracted.. put them in the product by update or create.

Extract all custom categories asociated with 1 external category is a simpler problem to solve.
Once the entire list of categories is locally in memory .. this check can be performed for each extenral category individually.
then .. the accumulated list of all customCategories ids.. can be deduplicated.

This function of extracting custom categories ids.. based on a list of external categories ids..
is very good separation of concerns.

getCustomCategoriesIds : List ExternalCategoryId -> List Categories -> List CustomCategoriesIds

  <!-- reduce over ExternalCategoryId, buy accumulating in a list..  -->
  getAsociatedCustomCategories: ExternalCategoryId -> List Categories -> List CustomCategoriesIds

  <!-- deduplicate. ids. -->

given this.. i need to alter the product data structure to include multiple custom categories.
also will include multiple external categories ids since we need to perform the update or no update check.
then the rest of the fields also.
externalProductId is also a field that we are itneresteed in later maybe.
shopName also.
so far the product needs to have:

shopName
externalProductId
externalCategoriesIds
customCategoriesIds


what i detected that the product .. we load all products from prestashop.. but we only save in firebase only certain of them.

The way we know who to save and who not.. it has to do with finding the custom category based on the external categories associate with a particular product.

So given that we load all products from prestashop.
And given that for each product we have external categories ids.
Then we extract the associated custom categories with this external categories... by reverse mapping.. by filtering and accumulating and de-duplicating over the list of categories.

If we have custom categories.. then we create this product in firebase .. and we dont then we dont do anything with this product.. since is not supposed to be included based on the custom categories that have been created.. and based on the associations between categories that we find.


How to detect if a product is removed in prestashoop?
First we detect if we are interesteed in it. Like we check if we have custom cats asociated with the shop product if we do then detect what action needs to be taken.
for remove, it needs to be in firebase but not inside the shop.
For this we need all productsIds in shop
and all products ids in firebase..
and by subtracting firebase  from the shop .. we can detect which ones have been deleted. Since firebase contains more.
Now this removed ones.. are better if we detect them as a collection not make this check for each individual product.. is more performant since later we can just use a transaction to accoiutn for this.

but what we wanna do first..
is filter out the allProductsFromPreshashop vs the productsFromPrestashop that we are interesteed into.
Call them important / related / relevantProducts .
yes.
relevantProducts vs allProducts
having the relevantProducts .. we can then compare with the customProducts .. and detect who is deleted, created or updated.





===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
16 iulie 2018
- bind event listeners to the products that are in cart.  
    - bind event for each product added.
    - bind events for each product when the app loads.
  Remove the item from cart if is removed from firebase.

  ===============================================================================================================================
  ===============================================================================================================================
  ===============================================================================================================================
  ===============================================================================================================================
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

===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================

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
