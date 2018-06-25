export default function CategoryCtrl($scope, $timeout, $stateParams, BackendService){
  const categoryId =  $stateParams.categoryId;

  $scope.category = null;



  if(categoryId){
    BackendService.getCategory(categoryId)
        .then(cat => {
          $scope.category = cat;

          BackendService.getFirstXProductsOfACategory(cat.id, 20)
            .then(products => {

              Object.keys(products).map(key => {
                $scope.category.addProductToCategory(products[key]);
              })

              $timeout(() => { $scope.$apply() }, 10);

            })
            .catch( err => {
              console.log(`Could not get products for the category with name: ${cat.name} and ${cat.id}`, err);
            });

          $timeout(() => { $scope.$apply() }, 10);

        })
        .catch(err => {
          console.log("could not load the category with id: ", categoryId, err);
        });

  }else{

    console.log("Dev Error: i forgot to pass the categoryId parameter into the ui-router sref call.");

  }



}
