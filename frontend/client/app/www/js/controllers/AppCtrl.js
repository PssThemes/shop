console.log("AppCtrl loaded..");

export default function AppCtrl($scope, $timeout, AuthService, $state) {

  $scope.favorites =  0;


  $scope.menu = [

    // Home page.
    { title: 'Home', icon: 'home', type: 'primary', state: "app.home",  },



    // About , terms and crap.
    // TODO: fix the about page.
    { title: 'About', icon: 'users', type: 'secondary', state: "app.home"},
    // TODO: fix the contact page.
    { title: 'Contact', icon: 'envelope', type: 'secondary', state: "app.home"},
    // TODO: fix the terms page.
    { title: 'Terms', icon: 'pushpin', type: 'secondary', state: "app.home" },
    // TODO: fix the account page.



    // User Profile
    { title: 'Account', icon: 'user', type: 'primary', state: "app.user-profile" },

    // User Favorites
    { title: 'Favs', icon: 'heart', type: 'secondary', state: "app.favorites" },

    // User Settings
    { title: 'Settings', icon: 'cog', type: 'secondary', state: "app.settings" },

    // NOTE: we said we remove msgs functionality.. we keep only product review msgs.
    // { title: 'Messages', icon: 'bubble', type: 'secondary', state: "app.home" },

  ];


  AuthService.onFavoritesChanged( howMany => {
    console.log(" AuthService.favorites.$watch : ", AuthService.favorites);

    $timeout(() => {
      $scope.$apply(() => {
        $scope.favorites = howMany;
      });
    }, 30);

  });


  //   console.log(AuthService.favorites);
  //   const nrOfFavs = AuthService.favorites.$value;
  //   if(nrOfFavs){
  //     return nrOfFavs;
  //   }
  //   return 0;
  // };


}
