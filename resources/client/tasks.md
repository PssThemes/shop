===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
12 september 2018

- fix back the test environment.
  - install the packages from tests.

- test out the work function.
  - test out the deleted products.
  - test out created products.




===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
03 september 2018

shopify

Ensure the de-associate categories code is working.

Cant figure otu why.. and i cant drill down in code to find where the problem comes.. since it requires many async calls.. so a better idea is to use fake data in a special way.
My that i mean.. i build a model with a base situation.. like products put inside categories.. so on.. just something fake.

then i will build specialized functions that do 1 thing.. like create an asociation.. remove an asociation.. create a product.. insert it .. so on..
then given this base fake data.. and given this named specialized functions..
using a combination of them i get the same effect as if i manully work in shopify.
Is not proper testing.. ill not implement tdd for now.. just this exercise will help me better understand the situation.
And later when i put a testing harness.. i will do the same thing.. fake data.. shape it with specialized functions.. then pass that trough the function beeing tested...
then expec tthe resutl to be what that actions is supposed to take.

How much time do i need to insert a testing harness into this project?
Do i need to modify something  that harsh?
Given that i dont need to manually fake data.. i can create products on the fly.. and insert them.. and do stuff.. like remove asociations and create categories and such..
I can also remove stuff ..by calling functions..
I can check for deep equality not like in javascript..

I will not need to use the repl.. i can just go tdd style on it.. and also .. i might use the repl too to test the fuinctions that modify the data..
This will take me another day or 2? Why?
Since setup of elm test in elm 1.0 it might be different then 0.18.. so what changed?

Advantages..
It might be the only way in which i can properly realized why things are not working.
It will clarify my thinking..
I will learn to use testing harness in 1.0.
It might be faster to finish the code this way...
I might start here and use this approach every time in the future in a backend elm project.
Elm is pure.. testing is super duper easy..


Can i compare return cmd types?
If not htf im gonna do anything?
I need to ask in slack..

Disadvantages..
It might take more time then expected.

What do i expect to take?
1 day.. or even 2.

Is it rely worth it..?
Given that prestashop might require the same crazy setup.. and code there is different.. then hmm.
I rather work on fake data and tests there too.

The only serious problem here is i cant go inside code itself and hook myself into it with expectations.. quite a limitation.

My actual problem is that i dont fully understand if the approach im having for dissociating products it actually works or not.
I need a way to test it.. as opposed to think about it in my head.
Make a bunch of asumptions.. and check if they are true.. But i cant have that qwithr async calls..
Too much time spent on refresh and looking up inside the repl..

What is the worst it can happen?
I can waste time.. to setup this harness.. and discover that the problem was a very simple one.. and this testing was not neded to begin with..
But testing is good regardless..
Clarifies thinking.. then also is easy to reread later.. add more clauses.. see what expectations we had..

The value is.. i can use the fake data i build 1.. just once.. for everything..
Since i can add and remove and transform it with special functions..
Ok so i have.
1. data.
2. functions for creating data.
3. functions for transforming.. modifing and so on.. this are equivalent with actions performed by me in shop or firebase or stuff.

Then i have a testing harness..
which uses this operations.. and my functions.. to test stuff.

Decision. Im gonna build a testing harness and test out a bunch of functions.
Also create this full blown fake data..
Then functions for manipulating it in specific ways.
Im also gonna build a fake model.
And test directly with the update function.

Also ask in slack how to test the commands im getting back for the update function.. How to test the update function in general.

===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
31 august 2018

How to detect what products are dissociated and remove them form firebase?
(1) One idea is that every time an external category is removed in fireabse - products need to be removed.
(2) Another is that every time a category is modified in shop .. meaning more products are added or removed form it.. things need to change in firebase.


If a category is empty.. all products that contained it.. will be deleted .. if it was the last category.

So if i get the list of all empty categories..
And remove them form allShopProducts.. then if a shop product has no category left on him.. is considered a dissociated product.
So second idea is handled. (2)

Removing all categories form a set.. that are in another set.. is done by reversing it.. and keeping only the stuff in a set.. that is not in another set.
- set difference is


===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
30 august 2018

Shopify:
DONE. Figure out why it duplicates the create functionality. WHY? Check our who of the following is right?
  - work is called multiple times in the same cycle and it actually starts processing.. so js is called multiple times.
  - there is no proper check that detects if a product needs to be created or not - check if created list is filled or not.

Test out delete functionality.
  - delete 1 product and see if gets deleted. DONE.
  - de asociate a product with a category and see if gets deleted.
    Behaviour: if from shopify i de asociate a product from a relevant category.. that product will not be removed form firebase.
    Why?
    Given that relecant categoires still contains that category.. even if is empoty.
    Given that relevant products is filtered after relevant categoires.
    Given that the product still exists in shop..

    PROBLEM DETECTED>
    If a category on shopify has no products.. then that category is excluded form the list of collects.
    Meaning if i try to delete products i need to know which ones have only one category.. and that is deleted.


    So right now i compare only products from fireabse and products from shiop. to detect who is deleted.
    But also i need alist of emppty cateogries..
    And i need to map over each shop product. And if that shop product... has only 1 cateogry .. and if that 1 category is in the empty categories list..
    then that shop product is not included in firebase.

    step 1. get list of empty external categories.
    step 2. filter the products form shop.. to only the ones with 1 external category.
        Q: Do i filter with all products or relevant products?
        Option1: Filtering with all products.. means i get all of tshop products.. and i ensure i dont escape anyone..
        Option2: Relevant products means only the ones witch have an extenral cateogry on them that is present on firebase.

        So given a relevant product.. with 1 category on him.. this means that category is not empty by design.
        So we are interested in products.. that have no categories on them.
        Aaa ok,.

        So Given that a product has no categories on him.. and given that is included in the list of relevant products... is this something which logically can happen?
        No. because to be a relevant product .. needs to have at least 1 category.. and that category needs to be present in firebase.
        Sooo. i means we need to use allProducts since a product with no categories cant posibly be a relevant product.

        So Turns out that any product which has no cateogry.. will be included in this list of de asociated products.

        Is it possible for a product to be in this list.. but not previously in firebase?
        Yes. since in previous step.. this product might not be relevant. Is just some non asociated prodcut.. that is isolated form what happens in firebase..
        Ok so still doers not matter..
        Since deletedProductsExternalIds is what we after.. and there will be a optional mapping between this list and what exists in firebase.

        SOoo.. final decision means :
        All shop products with no external categories on them.. are considered deleted.

        SO THIS ARE PRODUCTS WITH NO CATEGORIES ON THEM.

    step 3. filter the products form shop to only the the ones that have that 1 category included in the empty category list. this products are considered deleted even if tyhey exist in shop. hey will not exist in firebase since no category in firebase is asociating to them.
    step 4. extract the ids of this products.
    step 5. add them to the deleted external products list.


    ## What happens when a product is removed form 2 or 3  categories at the same time..(in the same cycle) and remains an orphan product?

    First what is the problem?
    If you diasociate a product.. then he is only supposed to be included .. only if the categories still remaining on him .. are present in firebase.
    So one way to filter products..
    Si to ensure that at least 1 of the externalCatId present on a shop product..
    Is present in firebase.

    If it has only 1 external category..
    That ensure that one is not an empty category.

    Also the problem is.. if the admin deletes and external category.. or empties it..
    The firebase is supposed to break that association automatically.
    Since having limping connections around is usless. This means we need to remove links to external categories also.


    Sumarry:
    Deleting a product can happend for two reasons:
    1. the product is actually deleted.
    2. the product is disassociated in a way that becomes irelevant to us.

    First case is handled with a simple set difference.

    But for second case we need to detect what it means that a product is disasociated in a way that becomes irelevant.

    Irelevant is any product that:
    1. has no external categories on it.
    2. has no external categories ..  after we filter out the ones that are deleted or emptied.
      So for each product.. we take out the external categoires which are present inside the emptyedOrDeletedExternalCategories.
      After this process.. if the product has no categories left on it .. it means is irelevant to us.

    Reversing this.. it means that if we take all shop products
    And for each one we take out the emptyedOrDeletedExternalCategories
    Then we endup with only relevant categories.

    ## How to detect what external categories are empty?
    IS the same issue with a deleted category.
    How to detect a deleted category?

    If an external category is in firebase... but not in the collects.. that means is deleted.. or empty.. since shopify behaves the same.
    So this means filtering over collects.. and extracting all external categories ids as a set..
    And getting the external categories form firebase..
    Set difference between what is in firebase and what in shopify.. will give us the categories existent in firebase but not in shopify.
    Which means this categories were deleted form shopify.

    step1: get all external cat ids form shop. as set. ShopSet
    step2: get all external cat ids form firebase. as set. FirebaseSet
    step3: return:  set differecne between FirebaseSet and  ShopSet
    DONE.
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
28 august 2018

Shopify.

- build a fake model in the fake data folder. DONE.
- test out if the functions we use give the appropriate results.
    - getExternalProductIdsFromFirebase DONE.
    - extractCategoryProductAsociations DONE .
    - extractCateogoryToCategoryAssociations DONE.

    - getRelevantProducts DONE.
    - getExternalProductIdsFromFirebase DONE.
    - getExternalProductsIdsFromShop DONE.

    - getDeletedProductsIds DONE.
    - findAsociatedInternalProductId DONE.
    - getCreatedProductsIds DONE.



- put a work message and use the update function to manually test we get what we want.

- test with real data.
- test delete product
- test create product
- test update product

PrestaShop.

Build the following:
- model
- init
- messages
- update
- subscriptions



===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
27 august 2018

Shopify .elm

Reconstructing the work function to include the new data structure,.
  - test out getExternalCategoriesFromFirebase DONE.
  - repare extractAsociations function and test it out.

===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
24 august 2018

Shopify.
- update the ports. DONE.
- need to ensure i get raw products in subscriptions..
- need to update the messages to include raw products instead of normalized products.
- once the collects are in.. transform the raw products in normalzied products.
- then vefiy that all the rest of the code is working.



===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
23 august 2018

So much of this is how you approach it.
I need to take out all important json objects for Shopify.
I need to take out all important json objects for Preshashop.

Reason beeing.. i constantly need to recheck if some json field is there or not..
The correct approach would be to just interogate the api.. take by copy paste whaty the json structure is..
what is expectedf for me to get in different situations..

Make fake data based on that.

And then use this fake data to make architecutre driven decisions. Not what im doing here. pff..

For shopify i need:
- external product.
- the collect.

For prestashop i need
- the product.
- the categories..  not sure if they are included directly in the rpoduct for example.
- the image

All this data is first dumped in a json object.. let js intelisense to format everything.. in a .json file or in a .js file..

then i reuse this later every time i need to check out something.
Knowing what do do in each particular situation that i get overwelmed in my bigest problem. I get decision overload..

DONE.

Need to thing if to include externalCatIds as a field on normalized product.. given that shopify does not provide the ids of categories in the request of product..
So what i can do is to createa na empty list..
And using that i can later load externalCatIds form inside the collects.
The aboive is for shopify..

But for prestashop is different.
I can have the external cat ids directly form the first call into the products.. which means i can use the decoder to do that.
Which is good since i dont need to do a specialized step later.

Problem with this approach is that im using a shared interface.. called a normalized product... but in reality i need 2.
One for raw shopify product.
And one for normalized Shopify product.

Which means.. all data that i can exteract from the first call.. is a raw thing..
All subsequent stuff .. like more async calls.. are done in some temporary struct in the model..
SO that at the end i get the proper normalized product.


For prestashop i can do it in 1 go..
But also if later we add more shops.. if i dont clearly .. or cleanly separate this 2.. i will get a bunch of problems..

From a cs perspective.. i rely need a clean separation .. an interface between the api call and the end normalized product struct..

But this means another specialized step for converting from raw in normalzied.
But fortunately this step is syncronic..since by the time we have the collects.. we also have the raw prodcuts..
SO the normalized product can easily be obtained.


This way the processing logic trapped in the decoder disappears..
The raw product will map very closely the same structure the json has in the api call..

Problem here can be the fact that objects can contain ids as keys.. but we have dic decoders which work wonders for that specific purpose.
I did not use a dict decoder until now...

this step of converting the raw in normalized product.. will take as agruments all the required stuff..


By the time we have normalzied products..
All functionality for all fucntions is the same.
Since it operates on the same datastructure.
Long description will be included there also.

This way our decoders are light.. and you can easily change the code in case the api for shopify changes in the background.. or you need more fields or something..
Separation of concerns.. and this loose coupling will enable me to add things later more easily..

But indeed is more work to create this extra step.

===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
22 august 2018

Take products form shopify and push them in firebase.
- load products form shopify in the system.
- get the categories for each product.
- asamble a base product for create.. we just need the push id which will get taken from within javascript.. everything else is decided in elm other then the push id.

- send all this data in javascript using a create port.
- send from javascript in firebase by mapping over the list and writing each product.
  letter we gonna use batch writes.


===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
18 august 2018

Shopify.

- detect our status.
- build some fake data:
  - build fake internal categories. done.
  - build 4 fake internal products.



===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
17 august 2018

Shopify.

- build the functions for processing.


- fix the ports and load everything..

- send stuff back into javascript.
- verify that is the correct stuff.




===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
16 august 2018

Next time i will build the data structure and im gonna start with core processing logic.
Then adjust everything after the datastructure.

Shopify core functionality in elm.


End golad is to endup with ids of products to remove, products to delete and products to update.
Then perform this actions.

products to delete are ones that are in firebase but not in shopify.
to detect this i need to see all ids of products in firebase..
and all ids of products in shopify.
but not all shopify products are relevant. i need to remove the ones that are not asociated with any category.
which means.. i need to ensure at least one external category present on the shopfiy product.. is present in a firebase asociation.
  - also here i need to get all external categories that are present in firebase. now of course this means ids not categoriy names.




===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
12 august 2018

Focus on building the datastructures i need
- internal product
-



===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
09 august 2018

Build elm environment:
DONE> - setup gulp and compile stuff automatically.. what a pain in the ass.

Test elm as an engime for compute.
DONE. - put elm stuff in the function.
DONE. - test that the elm gets the start message
DONE. - test that the set timeout works in elm .
DONE. - test that the finish message gets out
DONE. - respond to the request when finish msg happens .

Think architecture of elm.
- just a bit.. we gonna refactor later.

Build the prestashop function in elm.
- let shopify be.. build the prestashop one.

===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
09 august 2018

I'm trying to restart the cloud function again and make it work as before.
- find out the instructions inside functions emulator.


===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
08 august 2018

Clarification.
Settings loaded.
Internal categoires.. this are custom ones. DONE
relevant external cats.. this are ones that were asociated in firebase.
indexed by shop name .. good since a categori is unique in a shop.

loading external products.. ok..
groupigg togheter the external products and external categories.. making 2 acumulation indexing on each other..

relevant product ids.
meaning all externa lproducts.. are loaded.. but only some of them are actually neded ..

sooo..
we fiter allExternalProducts with the list of relevant stuff.
then we get only the relevant products.

from this.. we




===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
07 august 2018

-  



===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
06 august 2018

Prestashop function.
relevant cat external ids  means only the external categories that make snese

- load all products from prestashop


===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
28 june 2018

In shopify:

DONE. - test product creation
DONE. - test product deletion
DONE. - test test product update.

DONE. Create product 3.
DONE. Add the product 3 in 2 categories.
DONE. Check if product 3 is in firebase.
DONE. Check if product 3 has 2 external categories..

In prestashop.


===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
27 june 2018  

# Create a product functionality in shopify. DONE.
Build the product.
  - decide what fields i need, by looking up wahtivedone before.
Build the big description.

# modify the external products ids from shop set to be strings insteadf of numbers. DONE.
  - look inside getRelevantProductIds, and create a + "" for each add to the set.

# understand why productData is undefined. DONE.
  was a spelling mistake. fucking js.. dor de elm..

# test delete functionality by deleting product 1.3

# extract the coresponding product id. DONE.

# whats up with this error: externalProductId has already been declared?

# product does not get removed if you remove it form the collection... ?WHY?



===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
===============================================================================================================================
26 june 2018

I need to attach the custom categories when creating a product.
I only have external categories for each product.. this means i need to get the associated custom categories.. based on the provided external categories.

Best way to do it is for each external category.. to grab all the custom categories.
Repeat this for each external category..
Then accumulate all intenralCategoriesIds in a list.
Then dedupe that list.

extractAsociatedInternalCategories : List ExternalCatId -> List InternalCategory -> List InternalCategoryId
  extractIntenralCategoriesFor : ExternalCatId -> List InternalCategory -> List InternalCategoryId


Clarifing how to extract all the internalCategories which contain an asociation to a specific external category which is given (SCat).

for each intenral category.. IC
lookup the list of external categories asociated with it. LEC
if our specific external category .. SCat .. exist inside the LEC then we include IC id in the acumulator... or we just return true since this can be done with a filtering process also.


// NEXT: verify if extracting the asociated custom categories actually works.

// Next.
firgure out why exteact internal cats for a specific external cat doe snot work,.

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
