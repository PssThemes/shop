export default class DataService {

  constructor(BackendService, $rootScope){
      this.categories = {};
      this.products = {};

      BackendService.onCategoryAdded(cat => {
        this.categories[cat.id] = cat;
        $rootScope.$broadcast("categories_changed");
      });
  }



}
