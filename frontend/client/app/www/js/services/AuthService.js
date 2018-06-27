export default class AuthService {

  constructor(Auth){

    this.isLoggedIn = true;
    this.user = null;

    Auth.$onAuthStateChanged(user =>  {
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
