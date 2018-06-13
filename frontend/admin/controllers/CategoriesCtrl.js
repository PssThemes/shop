function CategoriesCtrl($scope, $timeout, BackendService, ShopsService) {

  // Initialization stuff:


  // -----------------------------------------------------
  // Load Categories
  // -----------------------------------------------------

  $scope.customCategories = {};
  // Load custom categories form backend.. and attach a default ui-state.
  BackendService.getCustomCategories()
    .then(obj => {
      $scope.customCategories = obj;
      $scope.$apply();
    })
    .catch(err => console.log("error when loading categories: ", err));



  // -----------------------------------------------------
  // Add Category
  // -----------------------------------------------------
  $scope.catBox = "";
  $scope.addCustomCategory = () => {
    BackendService.createCustomCategory(name)
      .then(() => {
        $scope.catBox = "";
      })
      .catch(err => console.log("error when creating the category: ", err));
  };

  BackendService.onCreateCustomCategory((catId, cat) => {
    $scope.customCategories[catId] = cat;
    $timeout(() => {
      $scope.$apply();
    }, 10);
  });

  // -----------------------------------------------------
  // Edit Category
  // -----------------------------------------------------
  $scope.editNameState = "";
  $scope.categorySelectedForEditing = null;
  $scope.updateEditNameState = (value) => {
    $scope.editNameState = value;
  }
  $scope.startEditingCategoryName = (catId) => {
    $scope.editNameState = $scope.customCategories[catId].name;
    $scope.categorySelectedForEditing = catId;
  };

  $scope.saveEdit = (catId) => {
    $scope.customCategories[catId].updateName($scope.editNameState);
    BackendService.updateCustomCategory(catId, $scope.customCategories[catId].getData());
    $scope.editNameState = ""
    $scope.categorySelectedForEditing = null;
  };

  $scope.cancelEdit = (catId) => {
    $scope.categorySelectedForEditing = null;
  };

  // -----------------------------------------------------
  // Remove Category
  // -----------------------------------------------------
  $scope.removeCategory = (catId) => {
    BackendService.deleteCustomCategory(catId)
      .catch(err => console.log("failed to delete custom category: ", err));
  }
  BackendService.onDeleteCustomCategory((catId) => {
    delete $scope.customCategories[catId];
  })
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

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