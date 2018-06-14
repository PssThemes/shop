function CategoriesCtrl($scope, $timeout, BackendService, ShopsService) {

  // Initialization stuff:


  // #region -- Load Categories
  // -----------------------------------------------------
  // Load Categories
  // -----------------------------------------------------
  // Load custom categories form backend.. and attach a default ui-state.
  // is impemented with: BackendService.onCreateCustomCategory() below.
  $scope.customCategories = {};
  // #/region -- Load Categories
  //
  // #region -- Add Category
  // -----------------------------------------------------
  // Add Category
  // -----------------------------------------------------
  $scope.catBox = "";
  $scope.addCustomCategory = () => {
    if ($scope.catBox.trim() != "") {
      BackendService.createCustomCategory($scope.catBox)
        .then(() => {
          $scope.catBox = "";
          $scope.$apply();
        })
        .catch(err => console.log("error when creating the category: ", err));
    }
  };

  BackendService.onCreateCustomCategory((catId, cat) => {
    // this is implemented on terms of child_added event
    // meaning will fire the first time app loads ..
    // and populates the categories list.
    $scope.customCategories[catId] = cat;
    $timeout(() => {
      $scope.$apply();
    }, 10);
  });
  // #/region -- Add Category
  //
  // #region Edit Category
  // -----------------------------------------------------
  // Edit Category
  // -----------------------------------------------------
  $scope.editNameState = "";
  $scope.categorySelectedForEditing = null;
  $scope.updateEditNameState = (value) => {
    $scope.editNameState = value;
  };

  $scope.startEditingCategoryName = (catId) => {
    $scope.editNameState = $scope.customCategories[catId].name;
    $scope.categorySelectedForEditing = catId;
  };

  $scope.saveEdit = (catId) => {
    // NOTE: the actual updating of the field is done by black magic with ng-model.
    // if there is a bug in editing .. start here.
    BackendService.updateCustomCategory(catId, $scope.customCategories[catId].getData());
    $scope.editNameState = ""
    $scope.categorySelectedForEditing = null;
  };

  $scope.cancelEdit = (catId) => {
    $scope.categorySelectedForEditing = null;
  };

  BackendService.onUpdateCustomCategory((catId, cat) => {
    $scope.customCategories[catId] = cat;
    $timeout(() => {
      $scope.$apply();
    }, 10);
  });
  // #/region Edit Category
  //
  // #region Remove Category
  // -----------------------------------------------------
  // Remove Category
  // -----------------------------------------------------
  $scope.removeCategory = (catId) => {
    BackendService.deleteCustomCategory(catId)
      .catch(err => console.log("failed to delete custom category: ", err));
  }
  BackendService.onDeleteCustomCategory((catId) => {

    // hide the modal if the selected category is the one beeing deleted.
    if ($scope.selectedForLinking == catId) {
      $scope.selectedForLinking = null;
    }
    delete $scope.customCategories[catId];
  })
  // #/region Remove Category
  //


  // ---------------------------------------
  // Link a customCategory with the ExtenralCategories available in the shops.
  // ---------------------------------------

  // Link categories in our system with the ones in the external shops.
  $scope.selectedForLinking = null;
  $scope.selectCategoryForLinking = catId => {
    // this will show the modal.
    $scope.selectedForLinking = catId;
  };
  $scope.unselectCategoryForLinking = () => {
    // this will hide the modal.
    $scope.selectedForLinking = null;
  };

  // ---------------------------------------
  // External Categories
  // ---------------------------------------
  $scope.externalCategories = {}
  ShopsService.loadExternalCategories()
    .then(extCats => {
      $scope.externalCategories = extCats;
      $timeout(() => {
        $scope.$apply();
      }, 10);
    })
    .catch(err => {
      console.log("failed to load the external categories: ", err);
    });


  // ---------------------------------------
  // Link to External Categories
  // ---------------------------------------
  $scope.addLinkToExternalCategory = (shopName, externalCat) => {

    const catId = $scope.selectedForLinking;

    // update locally.
    $scope.customCategories[catId].addLinkToExternalCategory(shopName, externalCat);

    // update on server..
    BackendService.updateCustomCategory(catId, $scope.customCategories[catId].getData())
      .catch(err => {
        console.log("could not create a link to an external cateogry: ", shopName, externalCat, err);
      });
  }


  $scope.removeLinkToExternalCategory = (shopName, externalCat) => {
    const catId = $scope.selectedForLinking;

    // remove locally
    $scope.customCategories[catId].removeLinkToExternalCategory(shopName, externalCat);

    // update the server.
    BackendService.updateCustomCategory(catId, $scope.customCategories[catId].getData())
      .catch(err => {
        console.log("could not remove a link to an external cateogry: ", shopName, externalCat, err);
      });
  }

  $scope.externalCategoryWasAlreadyLinked = (shopName, externalCat) => {
    const catId = $scope.selectedForLinking;
    if ($scope.customCategories[catId]) {
      // console.log("categoryHasAlreadyBeenLinked: ", $scope.customCategories[catId].categoryHasAlreadyBeenLinked);
      const crap = $scope.customCategories[catId].categoryHasAlreadyBeenLinked(shopName, externalCat);
      return crap;
    }
  }

  $scope.getSelectedCategoryName = () => {
    return $scope.customCategories[$scope.selectedForLinking].name;
  }
}

export default CategoriesCtrl;