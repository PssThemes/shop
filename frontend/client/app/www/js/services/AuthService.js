export default function AuthService ($firebaseAuth, $firebaseObject, $firebaseArray){

  this.authObj = $firebaseAuth();
  this.isLoggedIn = false;

  // firebase auth part of the user. THisis controlled by firebase.
  this.user = null;

  // user profile - the stuff we keep as metadata for each user.
  this.userProfile = null;
  this.cart = null;

  // favorites.
  this.favorites = null;
  this.favoriteObservers = [];


  this.authObj.$onAuthStateChanged(user =>  {

    if(user){
      // Here the user just logged in or registered.

      // mark the user as logged in.
      this.isLoggedIn = true;
      this.user = user;


      // now what we have the user, load the user profile.
      const userProfileRef = firebase.database().ref("users/" + user.uid);
      this.userProfile = $firebaseObject(userProfileRef);


      // load favorites of this user.
      this.favorites = $firebaseArray(userProfileRef.child("favorites"));
      this.favorites.$watch(newValue => {
        const howMany = this.favorites.reduce((acc, val ) => {
          acc = acc + 1;
          return acc;
        }, 0);

        this.favoriteObservers.forEach(observer => {
          observer(howMany);
        });

      })


      // load the shopping cart of this user.
      this.cart = $firebaseObject(userProfileRef.child("cart"));


    }else{
      // User just logged out.
      this.isLoggedIn = false;
      this.user = null;
    }

  });


  // #region Notify observers.

  this.onAuthStateChanged = (observer) => {
    this.authObj.$onAuthStateChanged(user => {
      observer(user);
    });
  }

  // #endregion Notify observers.


  // ---------------------
  // Favorite functionaity..
  // ---------------------
  this.onFavoritesChanged = (observer) =>  {
    this.favoriteObservers.push(observer);
  }

  this.isFavorite = productId => {
    if(this.favorites){
      // Note favorites is an object indexed by productId push keys.
      return this.favorites.$getRecord(productId) != null;
    } else {
      return false;
    }
  }


  this.toggleFavorite = productId => {
    if(this.isFavorite(productId)) {
      removeProductFromFavorites(productId, this.user.uid);
    } else {
      addProductToFavorites(productId, this.user.uid);
    }
  }





  // #region  Login stuff
  this.login = (email, password)  => {
    return new Promise((resolve,reject) => {

      this.authObj.$signInWithEmailAndPassword(email, password)
        .then(() => resolve())
        .catch(error =>  {

          let errorMessage = "";

          // TODO: look up the error codes in firebase and create the appropriate messages for each.
          if(error.code == "auth/argument-error"){
            errorMessage = "development error: please contact your admin."
          }else if(false){
            errorMessage = "another crappy error"
          }else{
            errorMessage = `problem with your login: ${error.message}`
          }

          reject(errorMessage);
        });

    });
  }
  // #endregion  Login stuff


  // #region LogOut

  this.logOut = () => {
    this.authObj.$signOut();
  }

  // #endregion LogOut


  // #region Register Stuff
  // TODO: i need to create functionality for creating a user profile inside firebase database too.

  this.register = (name, email, password) => {
    return new Promise ((resolve,reject) => {
      this.authObj.$createUserWithEmailAndPassword(email, password)
      .then( firebaseUser =>  {

        const user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: name
        })
        .then(() => {
          resolve(null);
        })
        .catch(err => {
          console.log("user was created but failed to save the displayName: ", err);
          resolve("we created your account but please reconfigure your display name form settings");
        })

        // create user an profile, since firbase auth is a different thing.
        createNewUserProfile(user);

      }).catch(function(error) {

        let errorMessage = "";
        // TODO: look up the error codes in firebase and create the appropriate messages for each.

        if(error.code == "auth/argument-error"){
          errorMessage = "development error: please contact your admin.";
        }else if(false){
          errorMessage = "another crappy error";
        }else{
          errorMessage = `problem with your registration: ${error.message}`;
        }

        reject(errorMessage);

      });
    })
  };
  // #endregion Register Stuff


  // #region User stuff

  this.getNumberOfFavorites = () => {
    if(this.user){
      const favs = this.user.favorites;
      if(favs){

        // user is logged in.. has favs.. reduce over list and count how many items are there.
        return Object.keys(favs).reduce((acc, key) => {
          return acc + favs[key];
        }, 0);

      }else{
        return 0;
      }
    }else{
      // user is NOT logged in.. return false.. deal with it in controller.
      return false;
    }
  };

  // #endregion User stuff


  // Shopping Cart functionaity .


}


function addProductToFavorites(productId, uid){
  firebase.database()
    .ref("users")
    .child(uid)
    .child("favorites")
    .child(productId)
    .set(productId);
}

function removeProductFromFavorites(productId, uid){
  firebase.database()
    .ref("users")
    .child(uid)
    .child("favorites")
    .child(productId)
    .set(null);
}

function createNewUserProfile(user){
  if(user){

    const userProfile = {
      name: user.displayName || "mr anonim",
      email: user.email,
      isBlocked: false,
      phone: "",

      // setup a dummy image if firbase does not supply one.
      profileImage: user.photoURL || "./img/avatar.jpg",

      uid: user.uid,
      address: {
        city: "",
        country: "",
        more: "",
        postalCode: "",
        state: "",
        street: "",
      }
    };

    const usersRef = firebase.database().ref("users");

    usersRef.child(user.uid)
      .set(userProfile)
      .catch(err => {
        console.log("could not create user profile: ", err);
      });

  }
}
