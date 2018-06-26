export default class UserService{

  constructor($rootScope){
    this.user = null;
  }

  // actions.
  logIn(email, password){
    return new Promise((resolve,reject) => {
      resolve();
    // login in firebase.

    // watch for changes in the user profile.

    });
  }

  register(email, password){
    return new Promise((resolve,reject) => {
      resolve();
    // login in firebase.

    // watch for changes in the user profile.

    });
  }

  logOut(){
    this.user = null;
    $rootScope.$broadcast("user:logout");
    // logrout in firebase auth.
  }



  // get information.

  isLoggedIn(){
    // return this.user != null;
    return false;
  }

  notLoggedIn(){
    // return this.user != null;
    return !this.isLoggedIn();
  }

  getUser(){
    return this.user;
  }

  getNumberOfFavorites(){
    return 3;
  }

}
