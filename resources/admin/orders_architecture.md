Page with all orders:
#### Order
```
{ id: OrderId
, date: Date
, purchases : List Purchase
, orderStatus : OrderStatus   
, userProfileId : UID
}
```

#### OrderStatus
```
OrderStatus = RECEIVED | PROCESSED | DELIVERED
```

#### Purchase
```
{ productId: ProductId
, productName : String
, productImage: String
, howMany: Int
, attributes : List String?? this will be problematic.
}
```

#### UserProfile
```
{ uid: String
, name : String
, email : String
, address : Address
, phone: String
, address: Address
, isBlocked: Bool
}
```

#### Address
```
{ street: String
, more: String
, city: String
, county: String
, country: String
, postalCode: String
}
```
