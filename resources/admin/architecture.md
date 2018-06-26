# Brainstorm Architecture
The following are the individual/self-contained units of data we have in this app:

## Product
```
{ id : FirebasePushId
, name: ProductName
, description: String
, description_short: String
, price: Float
, media: List {  url: String, alt: String }
, category: ?
, reviews: List Review
}
```
The description will contain the html .. with embed videos and so on..
We don't care.. we assume that it will come preformated directly from shopify or whatever .. for each individual product.

For now we assume media only contains an object with an url pointing to the image.
Also an alt for alternative text.

**??** Are categories nested.. like sub categories and such ... or is just a simple string?

**REPLY:**  yes -- we gonna use a folder/file bitree. and this allows a category to have products and other categories..

We gonna use a flat structure.. with a pointer  to parentCategory, childrenCategories and Products..

## Category
```
{ id: CategoryId
, name: String
<!-- , parentCategory: Maybe CategoryId -->
<!-- , childrenCategories: List CategoryId -->
, products : List ProductId
, mapper: List ExternalCategory
}
```

## Review
```
{ value: Maybe Int
, messsage: String
, user: UserName // this is user name not userId..
, replies: List Reply // only the admin can reply.. and only the client an add more messages.
}
```

## Reply
```
{ text : String
, who: Admin | Client
}
```

## ExternalCategory
This i will define later.. not sure what we do about nesting.. or maping nested categories..
I'm waiting to see the design..

**??** Do we let firebase handle accounts?
That is hard since we can't add the metadata we want.
We need to keep track of user id..
We can't modify passwords directly.. only

**REPLY:** yes, we use /users reference to store other types of data.


## User - is handled by firebase auth..
```
{ uid: UserId
, name: UserName
, email: String
, password: String
}

## UserProfile
```
{ uid: UserId
, name: UserName
, email: String
<!-- , allChats: List Chat -->
}
```
**??** Is the chat based on a particular product .. or is based on an order??
Or again .. we don't even complicate outselfs with different chats?
**REPLY:** Chats are based on products. No orders stuff neded.

## Chat
```
{ productWeAreDiscussingAbout : ProductId
, productData : {
    img: String
    , name: String
    , price: Float
  }
, messages: List Message
, client: UserId  
}
```

## Message
{ text: String
}
