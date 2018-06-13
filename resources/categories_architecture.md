# Categories Architecture.

In this system we allow the admin to create custom categories, and then link that with the existing categories in the shops provided in settings.

We have 2 main concepts.

1. CustomCategory .. this are used internally inside this system..
2. ExternalCategory .. which come form the shopify, magento and other stores.. in a uniform manner.

## CustomCategory.

Here we need to separate the `ui-state` from the `data-state` for each category.

`data-state` means how is data stored in firebase or whatever backend we are using.
`ui-state` means what is the current display state shown to the user. For example .. editing a category .. the edit mode is not saved to the server..
But we need to keep track of it in the controller.

So inside our controllers the CustomCategory will look like this:
```
{ // data state

, id: String
, name: String
, products : List Product

  // ui state
, editMode : Bool
, editName: String
, linkedTo: List ExternalCategory
}
```
