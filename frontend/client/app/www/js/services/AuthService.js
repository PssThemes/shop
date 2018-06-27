export default class AuthService {

  constructor($firebaseAuth){

    this.authObj = $firebaseAuth();
    this.isLoggedIn = false;
    this.user = null;

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
  // Login stuff
  // ---------------------

  login(email, password) {
    return new Promise((resolve,reject) => {

      this.authObj.$signInWithEmailAndPassword(email, password)
        .then(() => resolve())
        .catch(error =>  {

          const errorMessage = "";

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

      }).catch(function(error) {

        const errorMessage = "";
        // TODO: look up the error codes in firebase and create the appropriate messages for each.

        if(error.code == "auth/argument-error"){
          errorMessage = "development error: please contact your admin."

        }else if(false){
          errorMessage = "another crappy error"

        }else{
          errorMessage = `problem with your registration: ${error.message}`
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
