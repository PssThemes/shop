function CategoriesCtrl($scope, BackendService, ShopsService) {

  // Initialization stuff:
  // input for creating a new Custom Category
  $scope.catBox = "";

  $scope.customCategories = {};
  // Load custom categories form backend.. and attach a default ui-state.
  BackendService.getCustomCategories()
    .then(obj => {
      console.log("objjjjj ?", obj)
      $scope.customCategories = obj;
      console.log("$scope.customCategories ", $scope.customCategories);
      $scope.$apply();
    })
    .catch(err => console.log("error when loading categories: ", err));

  //   .then(cats => {
  //     const list =
  //       cats
  //       // add ui state.
  //       .map(cat => {
  //         // TODO: Refactor this into a CustomCategory object with a properly defined api..
  //         return {
  //           editMode: false,
  //           editName: "",
  //           name: cat.name,
  //           products: cat.products,
  //           id: cat.id
  //         }
  //       })
  //       // transform it into a nice indexed by categoryId object...
  //       // { CategoryId: Catregory}
  //       .reduce((acc, cat) => {
  //         acc[cat.id] = cat;
  //         return acc;
  //       }, {});
  //
  //   })

  // Load external categories form all available shops.
  // $scope.extenralCategories = ShopsService.loadExternalCategories();


  // ---------------------------------------
  // Add, remove or update the name of custom categories
  // ---------------------------------------

  // EDIT CATEGORY NAME
  // $scope.cancelEdit = catId => {
  //   $scope.customCategories[catId].editMode = false;
  // };
  //
  // $scope.saveEdit = catId => {
  //   $scope.customCategories[catId].editMode = false;
  //   // we wait for the real time backend to update the new name.
  //   BackendService.updateNameForCustomCategory(catId, newName);
  // }
  // $scope.addCustomCategory = () => {
  //   BackendService.addCustomCategory($scope.catBox);
  //   $scope.catBox = "";
  // }
  //
  // $scope.startEditingCategory = (key) => {
  //   $scope.customCategories[key].editMode = true;
  //   $scope.customCategories[key].editName = $scope.customCategories[key].name;
  // }
  //

  //
  // // receive an event for each new category aded.
  // BackendService.onCustomCategoryAdded((key, category) => {
  //   $scope.customCategories[key] = category;
  //   $scope.$apply();
  // });
  //
  // // receive an event for when a catregory is updated.
  // BackendService.onCustomCategoryUpdate((key, category) => {
  //   $scope.customCategories[key] = category;
  //   $scope.$apply();
  // });
  //
  // // receive an event when a custom category is removed.
  // // the key is the index of the category beeing removed.
  // BackendService.onCustomCategoryRemoved(key => {
  //   delete $scope.customCategories[key];
  //   $scope.$apply();
  // });
  //
  //


  // ---------------------------------------
  // Link a customCategory with the ones available in the shops.
  // ---------------------------------------




  // Link categories in our system with the ones in the external shops.
  $scope.selectedForLinking = null;
  // $scope.selectForLinking = catId => {
  //   // this will show the modal.
  //   $scope.selectedForLinking = catId;
  //   console.log("$scope.selectedForLinking: ", $scope.selectedForLinking);
  // };
  // $scope.unselectForLinking = () => {
  //   // this will hide the modal.
  //   $scope.selectedForLinking = null;
  // };
}

export default CategoriesCtrl;