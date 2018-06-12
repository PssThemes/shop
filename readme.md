# The Project File system

### /backend
contains stuff that only developers see:
  - firebase cloud functions
  - push notification infrastructure.
  - static content delivery infrastructure, we might use something else then firebase hosting.

### /frontend
Contains 2 apps one for the **entrepereneur (admin)** and one for the **users (client)**.

#### /admin
  Contains the app that is accessed by the admin to modify products, delete   users and so on.

#### /client
  Contains the user facing app.
  The users can see products, make orders, leave reviews etc..

The other folders and files are used for development only.
