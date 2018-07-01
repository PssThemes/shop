export default class AuthService {

  constructor($firebaseAuth, $firebaseObject){

    this.authObj = $firebaseAuth();
    this.$firebaseObject = $firebaseObject;

    this.isLoggedIn = false;
    this.user = null;
    this.userProfile = null;


    this.authObj.$onAuthStateChanged(user =>  {
      console.log("$onAuthStateChanged",user)
      if(user){
        this.isLoggedIn = true;
        this.user = user;
      }else{
        this.isLoggedIn = false;
        // this.isLoggedIn = false;
        this.user = null;
      }
    });

  }

  // ---------------------
  // Favorite functionaity..
  // ---------------------

  isFavorite(productId){
    console.log('isFavorite');
    if(this.user){
      return productId in this.user;
    }else{
      return false;
    }
  }

  addProductToFavorites(productId){
    firebase.database
      .ref("users")
      .child(this.user.uid)
      .child("favorites")
      .child(productId)
      .set(productId);
  }

  removeProductFromFavorites(productId){
    firebase.database
      .ref("users")
      .child(this.user.uid)
      .child("favorites")
      .child(productId)
      .set(null);
  }

  toggleFavorite(productId){
    console.log('toggleFavorite');
    console.log(this)
    if(this.isFavorite(productId)) {
      this.removeProductFromFavorites(productId).bind(this);
    } else {
      this.addProductToFavorites(productId).bind(this);
    }
  }

  // ---------------------
  // Notify observers.
  // ---------------------
  onAuthStateChanged(observer){
    this.authObj.$onAuthStateChanged(user => {
      observer(user);

      const userProfileRef = firebase.database().ref("users/" + user.uid);
      this.userProfile = this.$firebaseObject(userProfileRef);

    });
  }


  // ---------------------
  // Login stuff
  // ---------------------

  login(email, password) {
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

  logOut(){
    this.authObj.$signOut();
  }





  // ---------------------
  // Register stuff.
  // ---------------------
  // TODO: i need to create functionality for creating a user profile inside firebase database too.

  register(name, email, password){
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
  }





  // ---------------------
  // User stuff
  // ---------------------
  getNumberOfFavorites(){
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
  }

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
