===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
25 june 2018
what can i do today?

- first finish the shopify functionality no cloud function yet.

Clarify w2hat i need to do.
i have the settings..
the relevantexternal  cat ids..
which we use to detect what are the relevant products, by just exteracting their products ids.
then we filter out and retrive the relevant products by this.

! Focus on extracting the relevant products.
relevant product  means a product whos selfId.. or just id.. or externalProduct id .. exists in the relevantProductIds list we constructed erlier.

Test out the gouping.
  - create 2 categories..
  - each 2 with 2 products.
See if the grouping is done corectly by checking each id.
DONE.

Get ll products form shopify.
Normalize them by extracting only the data we use.

Need to clarify how to generate a relevant products ids...
If we group products by category.. we have a category to map against.
If a category exists in relevant external cats.. then we grab its products and dedupe it.
DONE.


Clarifinbg how to detect who needs to be deleted.
First we need just the ids of external relevant products..
and just the external ids of firebase products.
by comparing this 2 lists we can get the defleted products.




===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
23 june 2018

- get all categories for 1 product in shopify, i need them to detect if a product is relevant or not, since we make the backward asociation to detect relevance there. Need to do this first since in case is not possible then i need to change hole architecture approach for shopify.

For shopify
Ok just realized. One collect is logically a pair of 2 things, amongs others: 1 category id. and 1 product id.
So one product.. will have as many collects.. as categories it belongs into.
And collects are only for custom categories.
And a collect points to only 1 category and only 1.
Also the collects are not on the product itself.. no thgey are on thgeir own . and are accessed with a special call.. by providing the product id.
Which i think makese things very modular and composable in terms of architecture.
What is the actual reason on which the product does not contain collects on itself?>
Why? Not very clear about it but notheless seems important. Im gonna research later.
Getting all categories for a product .. is done by looking up all collects for a product.. using this url:

Retrieve only collects for a certain product
GET /admin/collects.json?product_id=632910392
RelevantExternalCategories


Hmm ok.. clarifying how to get the relevant products.
Given we have relevant external categories.. which are firebase driven..

We now need a list of all products indexed by extenral category id.
This will be like a dict with
Dict ExternalCatId (List ExternalProductId)

Using this and the relevantCategoryIds i can drop records form this dict.
Meaning we drop the irelevant categories that existend in thse shop/
Then accumulating over all proeducts in the remaining dict..
And deduplicating thouse..
Like im gonna acumulate with a set.. and im gonna use set.add() fu8nction to ensure no duplication happens.
This last set of externalProductIds will be the relelevant pducts.
Now given allExtenralProducts
And given the relevantProductids
We can get the relevantProducts.


The above works.
Now another way to do it is to start wiht the collects..
and instead of indexing by external category id.. i index based on external product id..
and i keep a list of categories around.
(this also could be done at the same time with 2 acumulators.. given that we can map over the collects only once, and accumulating stuff in 2 different acumulators.)
We need good names.

externalCategoriesIndexedByExternalProductId
productsIndexedByCategoryId

name byintention not by what it is.

productsGroupedByCategory
categoriesGroupedByProduct

For fgiltering out the relevant products.. we need a grouping by external category id + the deduplication.
But for making the products workable in firebase.. before the actual conversion.. im gonna map over them and attach to each one the
list of external categories.
This will be used when deciding if the update will be done or not.

Now given internalProductsIds, external ids..
and given we can extract externalProductsIds for real..

We can detect which products have been aded..removed or deleted.


From there.. we take the aproporiate action but we do it in bulk.

For delete.. we delete everythign in 1 go.
For create.. we need the internalCategoryId asociated with a product new created.
But given that we have many such custom categories for 1 product now..
What we gonna do is to make the custom categories ids.. or internal Categories.. an actual list.






===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
22 june 2018

# Shopify loading products functionality.
# Shopify cloud function.


# Prestashop functionality.
# Prestashop cloud function.

# Woocommerce functionality
# Woocomerce cloud function.

# Refactor all code.. put it in nice order since is a complete mess.
  build better names,
  build better delimitations.



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
