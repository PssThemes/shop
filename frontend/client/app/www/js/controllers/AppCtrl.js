export default function AppCtrl($scope) {

  $scope.menu = [
    { title: 'Home', icon: 'home', type: 'primary', state: "app.home" },
    // TODO: fix the about page.
    { title: 'About', icon: 'users', type: 'secondary', state: "app.home"},
    // TODO: fix the contact page.
    { title: 'Contact', icon: 'envelope', type: 'secondary', state: "app.home" },
    // TODO: fix the terms page.
    { title: 'Terms', icon: 'pushpin', type: 'secondary', state: "app.home" },
    // TODO: fix the account page.
    { title: 'Account', icon: 'user', type: 'primary', state: "app.login" },

    { title: 'Favs', icon: 'heart', type: 'secondary', state: "app.favorites" },

    // NOTE: we said we remove msgs functionality.. we keep only product review msgs.
    // { title: 'Messages', icon: 'bubble', type: 'secondary', state: "app.home" },

    { title: 'Settings', icon: 'cog', type: 'secondary', state: "app.settings" },
  ];

}
